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
import { MUser } from "../../Model/MUser";
import { NoSQLFactory } from "./NoSQLFactory";
var UserNSQL = (function () {
    function UserNSQL(AppParameter, Util) {
        this.AppParameter = AppParameter;
        this.Util = Util;
    }
    UserNSQL.prototype.TratamentoErros = function (Erros, RejectFunction) {
        if (Erros) {
            this.Util.Log(Error);
            RejectFunction(Erros);
            return true;
        }
        return false;
    };
    UserNSQL.prototype.SaveUser = function (User) {
        var _this = this;
        return new Promise(function (Resolve, Reject) {
            //Recuperando a base de dados local
            NoSQLFactory.getDatabase(_this.AppParameter).then(function (Database) {
                try {
                    /**
                     * Verificando se o usuario já existe
                     */
                    //Verificando se existe a tabela de usuarios
                    var Usuarios = Database.getCollection('Usuarios');
                    if (Usuarios === null) {
                        _this.Util.Log("Tabela de usuarios não encontrada, inicializando nova tabela");
                        Usuarios = Database.addCollection('Usuarios', { indices: ['UserLogin'] });
                    }
                    //Utilizando o MD5 na senha
                    var _Senha = _this.Util.Md5(User.getPassword());
                    //Tentamos recuperar o usuario da base
                    var _UsuarioBase = Usuarios.findOne({ "UserLogin": { "$eq": User.UserLogin } });
                    //Atualizando o objeto
                    if (_UsuarioBase) {
                        _UsuarioBase = _this.Util.toJsonFromClass(User, _UsuarioBase);
                        //Senha com o MD5
                        _UsuarioBase.UserPsw = _Senha;
                        Usuarios.update(_UsuarioBase);
                    }
                    else {
                        var _NewUser = _this.Util.toJsonFromClass(User);
                        //Senha com MD5
                        _NewUser.UserPsw = _Senha;
                        Usuarios.insert(_NewUser);
                    }
                    Resolve();
                }
                catch (E) {
                    Reject(E);
                }
            }).catch(function (Error) {
                //Logando o erro ao abrir a base local
                _this.Util.Log(Error);
                Reject(Error);
            });
        });
    };
    /**
     * Atualizando o usuario
     * @constructor
     */
    UserNSQL.prototype.UpdateUser = function (Database, User, Resolve, Reject) {
        var _this = this;
        Database.update({ "_id": "Usuario" }, { $push: { "Usuarios": User } }, { upsert: true }, function (Error, NumReplaced) {
            //Verificando erros na transação
            if (_this.TratamentoErros(Error, Reject))
                return;
            Resolve(NumReplaced);
        });
    };
    /**
     * Efetua o login na aplicacao
     * @param User
     * @param Password
     * @returns {Promise<MUser>}
     * @constructor
     */
    UserNSQL.prototype.Login = function (User, Password) {
        var _this = this;
        return new Promise(function (Resolve, Reject) {
            //Recuperando a base de dados local
            NoSQLFactory.getDatabase(_this.AppParameter).then(function (Database) {
                try {
                    /**
                     * Verificando se o usuario já existe
                     */
                    //Verificando se existe a tabela de usuarios
                    var Usuarios = Database.getCollection('Usuarios');
                    //Se não tiver tabela de usuarios, apenas resolvemos a promise sem parametros
                    if (Usuarios === null) {
                        Resolve();
                        return;
                    }
                    //Passando o hash na senha
                    var _Senha = _this.Util.Md5(Password);
                    //Tentamos recuperar o usuario da base
                    var _UsuarioBase = Usuarios.findOne({ '$and': [{ 'UserLogin': User }, { 'UserPsw': _Senha }] });
                    //Atualizando o objeto
                    if (_UsuarioBase)
                        Resolve(_this.Util.toClassFromJson(new MUser(), _UsuarioBase));
                    else
                        Resolve();
                }
                catch (E) {
                    //Logando o erro ao abrir a base local
                    _this.Util.Log(E);
                    Reject(E);
                }
            }).catch(function (Error) {
                //Logando o erro ao abrir a base local
                _this.Util.Log(Error);
                Reject(Error);
            });
        });
    };
    /**
     * Limpa o usuario logado
     * @constructor
     */
    UserNSQL.prototype.DeletaUsuarioLogado = function () {
        var _this = this;
        return new Promise(function (Resolve, Reject) {
            //Recuperando a base de dados local
            NoSQLFactory.getDatabase(_this.AppParameter).then(function (Database) {
                try {
                    /**
                     * Verificando se o usuario já existe
                     */
                    var Usuarios = Database.getCollection('Usuarios');
                    //Se não tiver tabela de usuarios, apenas resolvemos a promise sem parametros
                    if (Usuarios === null) {
                        Resolve();
                        return;
                    }
                    //Tentamos recuperar o usuario da base
                    var _UsuarioBase = Usuarios.findOne({ 'UserLogin': _this.AppParameter.getUser().UserLogin });
                    //Deletando o usuario da base local
                    Usuarios.remove(_UsuarioBase);
                    Resolve();
                }
                catch (E) {
                    //Logando o erro ao abrir a base local
                    _this.Util.Log(E);
                    Reject(E);
                }
            }).catch(function (Error) {
                //Logando o erro ao abrir a base local
                _this.Util.Log(Error);
                Reject(Error);
            });
        });
    };
    /**
     * Recupera a empresa e filial default se a mesma já existir
     * @returns {undefined}
     * @constructor
     */
    UserNSQL.prototype.EmpresaFilialDefault = function () {
        var _this = this;
        return new Promise(function (Resolve, Reject) {
            //Recuperando a base de dados local
            NoSQLFactory.getDatabase(_this.AppParameter).then(function (Database) {
                try {
                    //Verificando a tabela de sincronização. Se existir então é a primeira sincronização
                    var SyncConf = Database.getCollection('SyncConf');
                    if (!SyncConf)
                        Resolve();
                    else {
                        //Recuperando o registro
                        Resolve(SyncConf.findOne({}));
                    }
                }
                catch (E) {
                    //Logando o erro ao abrir a base local
                    _this.Util.Log(E);
                    Reject(E);
                }
            }).catch(function (Error) {
                //Logando o erro ao abrir a base local
                _this.Util.Log(Error);
                Reject(Error);
            });
        });
    };
    return UserNSQL;
}());
export { UserNSQL };
//# sourceMappingURL=UserNSQL.js.map