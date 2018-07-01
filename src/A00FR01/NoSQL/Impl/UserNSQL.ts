/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E00FR01 - Angular 2 corporativo                             ::
 ::  Arquivo     : UserNSQL.ts                                                 ::
 ::  Tipo        : Service                                                     ::
 ::  Descrição   : Implementação NOSQL para interface usuarios                 ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {IUser} from "../Interfaces/IUser";
import {NoSQLFactory} from "./NoSQLFactory";
import {AppParameters} from "../../Services/AppParameters";
import {CfyUtilServices} from "../../Services/CfyUtilServices";
import {CLog} from "../../Handler/CLog";
import {UserParameter} from "../../Interfaces/UserParameter";


export class UserNSQL implements IUser {


    constructor(
        private SQLFactory: NoSQLFactory,
        private AppParameter: AppParameters,
        private Log: CLog,
        private Util: CfyUtilServices) {

    }

    TratamentoErros(Erros, RejectFunction): boolean {
        if (Erros) {
            this.Log.LogError(Erros);
            RejectFunction(Erros);
            return true;
        }
        return false;
    }

    SaveUser(User: UserParameter): Promise<any> {
        return new Promise<any>((Resolve, Reject) => {
            //Recuperando a base de dados local
            this.SQLFactory.getDatabase().then(Database => {
                try {
                    /**
                     * Verificando se o usuario já existe
                     */
                        //Verificando se existe a tabela de usuarios
                    let Usuarios = Database.getCollection('Usuarios');
                    if (Usuarios === null) {
                        this.Log.Log("Tabela de usuarios não encontrada, inicializando nova tabela");
                        Usuarios = Database.addCollection('Usuarios', {indices: ['UserLogin']});
                    }
                    //Utilizando o MD5 na senha
                    const _Senha = this.Util.Md5(User.UserPsw);
                    //Tentamos recuperar o usuario da base
                    const _UsuarioBase = Usuarios.findOne({"UserLogin": {"$eq": User.UserLogin}});
                    //Atualizando o objeto
                    if (_UsuarioBase) {
                        //Adicionando a senha MD5
                        _UsuarioBase.UserPsw = _Senha;
                        Usuarios.update(_UsuarioBase, {"$loki" : _UsuarioBase.$loki});
                    }
                    else {
                        User.UserPsw = _Senha;
                        Usuarios.insert(User);
                    }
                    Resolve();
                }
                catch (E) {
                    Reject(E);
                }
            }).catch((Error) => {
                //Logando o erro ao abrir a base local
                this.Log.LogError(Error);
                Reject(Error);
            });
        });
    }

    /**
     * Efetua o login na aplicacao
     * @param User
     * @param Password
     * @returns {Promise<MUser>}
     * @constructor
     */
    Login(User: string, Password: string): Promise<UserParameter> {
        return new Promise<UserParameter>((Resolve, Reject) => {
            //Recuperando a base de dados local
            this.SQLFactory.getDatabase().then(Database => {
                try {
                    /**
                     * Verificando se o usuario já existe
                     */
                        //Verificando se existe a tabela de usuarios
                    const Usuarios = Database.getCollection('Usuarios');
                    //Se não tiver tabela de usuarios, apenas resolvemos a promise sem parametros
                    if (Usuarios === null) {
                        throw new Error("Colleção não inicializada, realizando o login online");
                    }
                    //Passando o hash na senha
                    const _Senha = this.Util.Md5(Password);
                    //Tentamos recuperar o usuario da base
                    const _UsuarioBase = Usuarios.findOne({'$and': [{'UserLogin': User}]});
                    //Atualizando o objeto
                    if (_UsuarioBase && _UsuarioBase.UserPsw == _Senha) {
                        //Realizando uma copia do usuario para não alterar a senha
                        const _UsuarioRetorno = this.Util.toClassFromJson(new UserParameter(), _UsuarioBase);
                        _UsuarioRetorno.UserPsw = Password;
                        Resolve(_UsuarioRetorno);
                    }
                    //Alterando o objeto na base local
                    else
                        Reject("Usuario não existente.");
                }
                catch (E) {
                    //Logando o erro ao abrir a base local
                    this.Log.LogError(Error);
                    Reject(E);
                }
            }).catch((Error) => {
                //Logando o erro ao abrir a base local
                this.Log.LogError(Error);
                Reject(Error);
            });
        });
    }

    /**
     * Limpa o usuario logado
     * @constructor
     */
    DeletaUsuarioLogado(): Promise<any> {
        return new Promise<UserParameter>((Resolve, Reject) => {
            //Recuperando a base de dados local
            this.SQLFactory.getDatabase().then(Database => {
                try {
                    /**
                     * Verificando se o usuario já existe
                     */
                    const Usuarios = Database.getCollection('Usuarios');
                    //Se não tiver tabela de usuarios, apenas resolvemos a promise sem parametros
                    if (Usuarios === null) {
                        Resolve();
                        return;
                    }
                    //Tentamos recuperar o usuario da base
                    const _UsuarioBase = Usuarios.findOne({'UserLogin': this.AppParameter.UsuarioLogado.UserLogin});
                    //Deletando o usuario da base local
                    Usuarios.remove(_UsuarioBase);
                    Resolve();
                }
                catch (E) {
                    //Logando o erro ao abrir a base local
                    this.Log.LogError(Error);
                    Reject(E);
                }
            }).catch((Error) => {
                //Logando o erro ao abrir a base local
                this.Log.LogError(Error);
                Reject(Error);
            });
        });
    }

    /**
     * Recupera a empresa e filial default se a mesma já existir
     * @returns {undefined}
     * @constructor
     */
    EmpresaFilialDefault(): Promise<any> {
        return new Promise<any>((Resolve, Reject) => {
            //Recuperando a base de dados local
            this.SQLFactory.getDatabase().then(Database => {
                try {
                    //Verificando a tabela de sincronização. Se existir então é a primeira sincronização
                    const SyncConf = Database.getCollection('SyncConf');
                    if (!SyncConf)
                        Resolve();
                    else {
                        //Recuperando o registro
                        Resolve(SyncConf.findOne({}));
                    }
                }
                catch (E) {
                    //Logando o erro ao abrir a base local
                    this.Log.LogError(Error);
                    Reject(E);
                }
            }).catch((Error) => {
                //Logando o erro ao abrir a base local
                this.Log.LogError(Error);
                Reject(Error);
            });
        });
    }

    /**
     * Atualizando o usuario
     * @constructor
     */
    private UpdateUser(Database, User, Resolve, Reject) {
        Database.update({"_id": "Usuario"}, {$push: {"Usuarios": User}}, {upsert: true}, (Error, NumReplaced) => {
            //Verificando erros na transação
            if (this.TratamentoErros(Error, Reject)) return;
            Resolve(NumReplaced);
        });
    }
}
