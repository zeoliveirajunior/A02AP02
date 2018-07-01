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
import { NoSQLFactory } from "./NoSQLFactory";
var SincronizacaoNSQL = (function () {
    function SincronizacaoNSQL(AppParameter, Util) {
        this.AppParameter = AppParameter;
        this.Util = Util;
    }
    /**
     * Verifica se existe a tabela de sincronização
     * @returns {Promise<any>}
     * @constructor
     */
    SincronizacaoNSQL.prototype.VerificaPrimeiraSincronizacao = function () {
        var _this = this;
        return new Promise(function (Resolve, Reject) {
            NoSQLFactory.getDatabase(_this.AppParameter).then(function (Database) {
                //Verificando a tabela de sincronização. Se existir então é a primeira sincronização
                var SyncConf = Database.getCollection('SyncConf');
                if (!SyncConf)
                    Resolve();
                else {
                    //Recuperando o registro
                    Resolve(SyncConf.findOne({}));
                }
            }).catch(function (Error) {
                _this.Util.Log(Error);
                Reject(Error);
            });
        });
    };
    /**
     * Setando os parametros da aplicação para indicar que uma primeira sincronização foi realizada
     * @returns {Promise<boolean>}
     * @constructor
     */
    SincronizacaoNSQL.prototype.SalvaSincronizacao = function () {
        var _this = this;
        return new Promise(function (Resolve, Reject) {
            NoSQLFactory.getDatabase(_this.AppParameter).then(function (Database) {
                //Verificando a tabela de sincronização. Se existir então é a primeira sincronização
                var SyncConf = Database.getCollection('SyncConf');
                if (!SyncConf) {
                    _this.Util.Log("Criando tabela SyncConf");
                    SyncConf = Database.addCollection('SyncConf');
                }
                var _NovoRegistro = {
                    Empresa: _this.AppParameter.getUser().EmpresaNumero,
                    Filial: _this.AppParameter.getUser().FilialNumero
                };
                //Deleta os itens
                SyncConf.chain().find({}).remove();
                //Inserindo o item
                SyncConf.insert(_NovoRegistro);
                Resolve();
            }).catch(function (Error) {
                _this.Util.Log(Error);
                Reject(Error);
            });
        });
    };
    /**
     * Faz a Verificação dos itens que devem ser sincronizados
     * @returns {Promise<any>}
     * @constructor
     */
    SincronizacaoNSQL.prototype.VerificaItensParaSincronizar = function (Tabelas) {
        var _this = this;
        return new Promise(function (Resolve, Reject) {
            NoSQLFactory.getDatabase(_this.AppParameter).then(function (Database) {
                try {
                    /**
                     * Se não recebeu nada, então apenas retorna o valor
                     */
                    if (!Tabelas || Tabelas.length == 0) {
                        Resolve();
                        return;
                    }
                    //Verificando se a tabela já existe
                    var _Tabela_1 = Database.getCollection("Sincronizacao");
                    //Se não existir, então temos que sincronizar todos os registros
                    if (!_Tabela_1) {
                        Resolve(Tabelas);
                        return;
                    }
                    //Senão, fazemos um loop nas coleções para verificar quais ainda não existem
                    var _TabelasRetorno_1 = [];
                    //Recuperando todos os elementos da sincronização
                    _Tabela_1 = _Tabela_1.find({});
                    Tabelas.forEach(function (Elemento) {
                        for (var i = 0; i < _Tabela_1.length; i++) {
                            if (Elemento.XX933_NR_SINC == _Tabela_1[i].XX933_NR_SINC) {
                                //Verificando a versão
                                if (Elemento.XX933_NR_VER != _Tabela_1[i].XX933_NR_VER)
                                    _TabelasRetorno_1.push(Elemento);
                                return;
                            }
                        }
                        //Se chegou até aqui então a sincronização não existe na base de dados local
                        _TabelasRetorno_1.push(Elemento);
                    });
                    Resolve(_TabelasRetorno_1.length > 0 ? _TabelasRetorno_1 : undefined);
                }
                catch (E) {
                    _this.Util.Log(E);
                    Reject(E);
                }
            }).catch(function (Error) {
                _this.Util.Log(Error);
                Reject(Error);
            });
        });
    };
    /**
     * Faz a Sincronização
     * @param Tabela
     * @param Registros
     * @constructor
     */
    SincronizacaoNSQL.prototype.SincronizaTabela = function (Tabela, Registros) {
        var _this = this;
        return new Promise(function (Resolve, Reject) {
            var _NomeTabela = Tabela.XX933_VC_TABELA;
            var _TabelaIndices = _this.AppParameter.Database.Documentos[_NomeTabela];
            //Caso exista a tabela parametrizada, então criamos
            if (_TabelaIndices) {
                NoSQLFactory.getDatabase(_this.AppParameter).then(function (Database) {
                    try {
                        //Verificando se a tabela já existe
                        var _Tabela = Database.getCollection(_NomeTabela);
                        //Se não existir, criamos a tabela
                        if (!_Tabela) {
                            _this.Util.Log("Criando tabela " + _NomeTabela);
                            _Tabela = Database.addCollection(_NomeTabela, { indices: _TabelaIndices });
                        }
                        else
                            //Limpando a tabela
                            _Tabela.chain().find({}).remove();
                        if (Registros && Registros.length > 0) {
                            _Tabela.insert(Registros);
                        }
                        //Faz a atualização da tabela e envia os dados novamente
                        _this.AtualizaSincronizacao(Tabela, Database, Resolve, Reject);
                    }
                    catch (E) {
                        Reject(E);
                    }
                }).catch(function (Error) {
                    _this.Util.Log(Error);
                    Reject(Error);
                });
            }
            else {
                Resolve();
            }
        });
    };
    /**
     * Faz a atualização da sincronização nas tabelas locais
     * @param Tabela
     * @param Database
     * @param Resolve
     * @param Reject
     * @constructor
     */
    SincronizacaoNSQL.prototype.AtualizaSincronizacao = function (Tabela, Database, Resolve, Reject) {
        try {
            var _SincronizacaoTabela = Database.getCollection("Sincronizacao");
            //Criando a tabela se não existir
            if (!_SincronizacaoTabela) {
                this.Util.Log("Criando tabela de sincronização...");
                _SincronizacaoTabela = Database.addCollection("Sincronizacao", { indices: ["XX933_NR_SINC"] });
            }
            //Verificando se o registro já existe
            var _Registro = _SincronizacaoTabela.findOne({ "XX933_NR_SINC": Tabela.XX933_NR_SINC });
            if (!_Registro)
                _SincronizacaoTabela.insert(Tabela);
            else
                _SincronizacaoTabela.update(this.Util.toClassFromJson(_Registro, Tabela));
            Resolve();
        }
        catch (E) {
            Reject(E);
        }
    };
    return SincronizacaoNSQL;
}());
export { SincronizacaoNSQL };
//# sourceMappingURL=SincronizacaoNSQL.js.map