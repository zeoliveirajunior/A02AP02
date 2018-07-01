/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E00FR01 - Angular 2 corporativo                             ::
 ::  Arquivo     : SincronizacaoNSQL.ts                                        ::
 ::  Tipo        : Service                                                     ::
 ::  Descrição   : Implementação NOSQL para interface de sincronizacao         ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {ISincronizacao} from "../Interfaces/ISincronizacao";
import {CfyUtilServices} from "../../Services/CfyUtilServices";
import {AppParameters} from "../../Services/AppParameters";
import {NoSQLFactory} from "./NoSQLFactory";
import {CLog} from "../../Handler/CLog";


export class SincronizacaoNSQL implements ISincronizacao {

    constructor(
        private SQLFactory: NoSQLFactory,
        private AppParameter: AppParameters,
        private Log: CLog,
        private Util: CfyUtilServices) {

    }

    /**
     * Verifica se existe a tabela de sincronização
     * @returns {Promise<any>}
     * @constructor
     */
    VerificaPrimeiraSincronizacao(): Promise<boolean> {
        return new Promise<boolean>((Resolve, Reject) => {
            this.SQLFactory.getDatabase().then((Database) => {
                //Verificando a tabela de sincronização. Se existir então é a primeira sincronização
                const SyncConf = Database.getCollection('SyncConf');
                if (!SyncConf)
                    Resolve();
                else {
                    //Recuperando o registro
                    Resolve(SyncConf.findOne({
                        Empresa: this.AppParameter.UsuarioLogado ? this.AppParameter.UsuarioLogado.EmpresaNumero : null,
                        Filial: this.AppParameter.UsuarioLogado ? this.AppParameter.UsuarioLogado.FilialNumero : null
                    }));
                }
            }).catch((Error) => {
                this.Log.LogError(Error);
                Reject(Error);
            });
        });
    }

    /**
     * Setando os parametros da aplicação para indicar que uma primeira sincronização foi realizada
     * @returns {Promise<boolean>}
     * @constructor
     */
    SalvaSincronizacao(): Promise<any> {
        return new Promise<any>((Resolve, Reject) => {
            this.SQLFactory.getDatabase().then((Database) => {
                //Verificando a tabela de sincronização. Se existir então é a primeira sincronização
                let SyncConf = Database.getCollection('SyncConf');
                if (!SyncConf) {
                    this.Log.Log("Criando tabela SyncConf", 1);
                    SyncConf = Database.addCollection('SyncConf');
                }
                const _NovoRegistro = {
                    Empresa: this.AppParameter.UsuarioLogado.EmpresaNumero,
                    Filial: this.AppParameter.UsuarioLogado.FilialNumero
                };
                //Deleta os itens
                SyncConf.chain().find({}).remove();
                //Inserindo o item
                SyncConf.insert(_NovoRegistro);
                Resolve();
            }).catch((Error) => {
                this.Log.LogError(Error);
                Reject(Error);
            });
        });
    }

    /**
     * Faz a Verificação dos itens que devem ser sincronizados
     * @returns {Promise<any>}
     * @constructor
     */
    VerificaItensParaSincronizar(Tabelas): Promise<Array<any>> {
        return new Promise<Array<any>>((Resolve, Reject) => {
            this.SQLFactory.getDatabase().then((Database) => {
                try {
                    /**
                     * Se não recebeu nada, então apenas retorna o valor
                     */
                    if (!Tabelas || Tabelas.length == 0) {
                        Resolve();
                        return;
                    }

                    //Verificando se a tabela já existe
                    let _Tabela = Database.getCollection("Sincronizacao");
                    //Se não existir, então temos que sincronizar todos os registros
                    if (!_Tabela) {
                        Resolve(Tabelas);
                        return;
                    }
                    //Senão, fazemos um loop nas coleções para verificar quais ainda não existem
                    const _TabelasRetorno = [];
                    //Recuperando todos os elementos da sincronização
                    _Tabela = _Tabela.find({XX933_NR_EMPRESA : this.AppParameter.UsuarioLogado.EmpresaNumero,
                        '$or' : [{
                            XX933_NR_FILIAL : this.AppParameter.UsuarioLogado.FilialNumero
                        }, {
                            XX933_NR_FILIAL : 0
                        }]});
                    Tabelas.forEach((Elemento) => {
                        for (let i = 0; i < _Tabela.length; i++) {
                            if (Elemento.XX933_NR_SINC == _Tabela[i].XX933_NR_SINC) {
                                //Verificando a versão
                                if (Elemento.XX933_NR_VER != _Tabela[i].XX933_NR_VER)
                                    _TabelasRetorno.push(Elemento);
                                return;
                            }
                        }
                        //Se chegou até aqui então a sincronização não existe na base de dados local
                        _TabelasRetorno.push(Elemento);
                    });
                    Resolve(_TabelasRetorno.length > 0 ? _TabelasRetorno : undefined);

                }
                catch (E) {
                    this.Log.LogError(Error);
                    Reject(E);
                }
            }).catch((Error) => {
                this.Log.LogError(Error);
                Reject(Error);
            });
        });
    }

    /**
     * Faz a Sincronização
     * @param Tabela
     * @param Registros
     * @constructor
     */
    SincronizaTabela(Tabela: any, Registros): Promise<any> {
        return new Promise<any>((Resolve, Reject) => {
            const _NomeTabela = Tabela.XX933_VC_TABELA;
            const _TabelaIndices = this.AppParameter.Database.Documentos[_NomeTabela];
            //Caso exista a tabela parametrizada, então criamos
            if (_TabelaIndices) {
                this.SQLFactory.getDatabase().then((Database) => {
                    try {
                        //Verificando se a tabela já existe
                        let _Tabela = Database.getCollection(_NomeTabela);
                        //Se não existir, criamos a tabela
                        if (!_Tabela) {
                            this.Log.Log("Criando tabela " + _NomeTabela, 2);
                            _Tabela = Database.addCollection(_NomeTabela, {indices: _TabelaIndices});
                        }
                        //Se já existir, limpamos toda a tabela
                        else
                        //Limpando a tabela
                            _Tabela.chain().find({}).remove();
                        if (Registros && Registros.length > 0) {
                            _Tabela.insert(Registros);
                        }
                        //Faz a atualização da tabela e envia os dados novamente
                        this.AtualizaSincronizacao(Tabela, Database, Resolve, Reject);
                    }
                    catch (E) {
                        Reject(E);
                    }
                }).catch((Error) => {
                    this.Log.LogError(Error);
                    Reject(Error);
                });
            }
            else {
                Resolve();
            }
        });
    }

    /**
     * Faz a atualização da sincronização nas tabelas locais
     * @param Tabela
     * @param Database
     * @param Resolve
     * @param Reject
     * @constructor
     */
    private AtualizaSincronizacao(Tabela: any, Database, Resolve, Reject) {
        try {
            let _SincronizacaoTabela = Database.getCollection("Sincronizacao");
            //Criando a tabela se não existir
            if (!_SincronizacaoTabela) {
                this.Log.Log("Criando tabela de sincronização...");
                _SincronizacaoTabela = Database.addCollection("Sincronizacao", {indices: ["XX933_NR_SINC"]});
            }
            //Verificando se o registro já existe
            const _Registro = _SincronizacaoTabela.findOne({"XX933_NR_SINC": Tabela.XX933_NR_SINC});
            if (!_Registro) {
                _SincronizacaoTabela.insert(Tabela);
            }
            else
                _SincronizacaoTabela.update(this.Util.toClassFromJson(_Registro, Tabela));
            Resolve();
        }
        catch (E) {
            Reject(E);
        }
    }
}