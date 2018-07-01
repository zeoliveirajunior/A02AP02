/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E00FR01 - Angular 2 corporativo                             ::
 ::  Arquivo     : NoSQLFactory.ts                                             ::
 ::  Tipo        : Service                                                     ::
 ::  Descrição   : Fabrica para comunicação com a interface NOSQL              ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
import * as Loki from 'lokijs';
var NoSQLFactory = (function () {
    function NoSQLFactory() {
    }
    /**
     * Recupera a base de dados local
     */
    NoSQLFactory.getDatabase = function (AppParameter) {
        var _this = this;
        return new Promise(function (Resolve, Reject) {
            if (!_this.DataBase) {
                try {
                    /*if (1 == 1)
                    throw "oi";*/
                    var _DbName = AppParameter.Database["Database"] + AppParameter.Database["Versao"];
                    var _Adapter = new Loki("").getIndexedAdapter();
                    var _Db_1 = new Loki(_DbName, {
                        adapter: new _Adapter(_DbName),
                        autoload: true,
                        autoloadCallback: function () {
                            _this.DataBase = _Db_1;
                            Resolve(_Db_1);
                        },
                        autosave: true,
                        autosaveInterval: 10000,
                    });
                }
                catch (E) {
                    Reject(E);
                }
            }
            else
                Resolve(_this.DataBase);
        });
    };
    return NoSQLFactory;
}());
export { NoSQLFactory };
//# sourceMappingURL=NoSQLFactory.js.map