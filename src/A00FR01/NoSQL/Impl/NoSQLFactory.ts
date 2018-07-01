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

import {AppParameters} from "../../Services/AppParameters";
import {Injectable} from "@angular/core";

declare var loki;
declare var LokiIndexedAdapter;
declare var lfsa;
declare var LokiNativescriptAdapter;

@Injectable()
export class NoSQLFactory {

    private DataBase;

    constructor(
        private AppParameter: AppParameters) {
    }

    /**
     * Recupera a base de dados local
     */
    getDatabase(): Promise<any> {
        return new Promise<any>((Resolve, Reject) => {
            if (!this.DataBase) {
                try {
                    const _DbName = this.AppParameter.Database["Database"] + this.AppParameter.Database["Versao"];
                    const _Db = new loki(_DbName, {
                        adapter: this.getAdapterDB(),
                        autoload: true,
                        autoloadCallback: () => {
                            this.DataBase = _Db;
                            Resolve(_Db);
                        },
                        autosave: true,
                        autosaveInterval: 1000,
                    });
                }
                catch (E) {
                    Reject(E);
                }
            }
            else
                Resolve(this.DataBase);
        });
    }

    private getAdapterDB() {
        //Mobile
        if (this.AppParameter.Ambiente.TpTecnologia == 3) {
            return new LokiNativescriptAdapter();
        }
        //Electron
        else if (this.AppParameter.Ambiente.TpTecnologia == 2) {
            return new lfsa();
        }
        //Se o tipo for Brownser, utilizamos o adapter de browser (Utilizara o Indexed DB paginado
        else {
            return new LokiIndexedAdapter();
        }
    }
}
