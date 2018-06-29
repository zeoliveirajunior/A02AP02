/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Tipo        : Serviço                                                     ::
 ::  Descrição   : Serviço para realizar Chamadas Http                         ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppParameters} from "./AppParameters";
import {Observable} from "rxjs";
import {CfyDialog} from "./CfyDialog";
import {CLog} from "../Handler/CLog";
import {IHttpError} from "../Interfaces/IHttpError";

@Injectable({
    providedIn: 'root'
})
export class CfyHttpService {

    constructor(private HttpClient: HttpClient,
                private Dialog: CfyDialog,
                private Log: CLog,
                private AppParameter: AppParameters) {

    }

    Post(Url, Parameters, ShowLoading?: boolean, Mensagem:string = "CFYLOGINSERVICE_SHOW_WAIT_DEFAULT_MESSAGE"): Observable<any> {
        this.Log.Log(`Realizando chamada post para o endereço ${this.AppParameter.Ambiente.Url + Url}...`, 4);
        let _Headers = new HttpHeaders().set('Content-Type', 'application/json');
        if (this.AppParameter.AutToken)
            _Headers = _Headers.set("aut-token", this.AppParameter.AutToken);
        if (ShowLoading)
            this.Dialog.ShowWaitWindow(Mensagem);
        return new Observable(Observer => {
            this.HttpClient.post<any>(this.AppParameter.Ambiente.Url + Url, Parameters, {
                observe: 'response',
                headers: _Headers
            }).subscribe(
                    (Result) => {
                        if (ShowLoading)
                            this.Dialog.HideWaitWindow();
                        let _AutToken = Result.headers.get("aut-token");
                        if (_AutToken) {
                            this.AppParameter.AutToken = _AutToken;
                            this.Log.Log("Recebido um novo token de autenticação", 1);
                        }
                        Observer.next(Result.body);
                        Observer.complete();
                    },
                    (Error => {
                        if (ShowLoading)
                            this.Dialog.HideWaitWindow();
                        let _Erro: IHttpError = {
                            Status: Error.status,
                            Mensagem: Error.error ? Error.error.message : null,
                            Stacktrace: Error.error ? Error.error.StackTrace : Error.stack,
                            ObjetoErro: Error
                        };
                        Observer.error(_Erro);
                        Observer.complete();
                    })
                )
        });

    }
}
