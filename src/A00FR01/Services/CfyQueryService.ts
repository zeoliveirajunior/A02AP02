/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : M00FR01 - Mobile Ionic 2                                    ::
 ::  Arquivo     : FacDate.ts                                                  ::
 ::  Tipo        : Service                                                     ::
 ::  Descrição   : Funções relacionadas a data                                 ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {MQueryParameters} from "./../Model/MQueryParameters";
import {AppParameters} from "./AppParameters";
import {CfyLoginService} from "./CfyLoginService";
import {CfyDialog} from "./CfyDialog";
import {CfyHttpService} from "./CfyHttpService";
import {CLog} from "../Handler/CLog";
import {IHttpError} from "../Interfaces/IHttpError";


/*
 Funcionalidades de modal e notificações
 */
@Injectable({
    providedIn: 'root'
})
export class CfyQueryService {

    // Injeção de dependencias
    constructor(private AppParameter: AppParameters,
                private Log: CLog,
                private LoginService: CfyLoginService,
                private Dialog: CfyDialog,
                private FacHttpService: CfyHttpService) {
    }

    /**
     * Executa uma consulta no banco de dados
     */
    public Exec(Parameters: MQueryParameters): Observable<Array<any>> {
        return new Observable<Array<any>>((ObservableObj) => {
            //Validando se temos informações do usuario em memoria
            if (!this.AppParameter.UsuarioLogado ||
                !this.AppParameter.UsuarioLogado.UserLogin ||
                !this.AppParameter.UsuarioLogado.UserPsw ||
                !this.AppParameter.UsuarioLogado.EmpresaNumero ||
                !this.AppParameter.UsuarioLogado.FilialNumero) {
                let _Error: IHttpError = {
                    Status: -1,
                    Stacktrace: null,
                    Mensagem: 'CFYQUERYSERVICE_ERROR_SEM_USUARIO_PREENCHIDO',
                    ObjetoErro: Error
                };
                this.TratamentoErros(_Error, ObservableObj, Parameters);
            }
            this.Log.Log(`Realizando a consulta ${Parameters.Query}`, 2);
            if (!this.AppParameter.isLogged()) {
                this.Log.Log(`Usuario não logado, realizando o login de ${this.AppParameter.UsuarioLogado.UserName} novamente...`, 1);
                this.DoLoginBackground(Parameters.ShowWaitWindow).subscribe(() => {
                    this.Log.Log(`Login realizado com sucesso`, 1);
                    this.ExecAfterLogin(Parameters, ObservableObj);
                }, (Error) => {
                    this.VerificaConfirmacaoLogin(Error, Parameters);
                });
            }
            else
                this.ExecAfterLogin(Parameters, ObservableObj);
        });
    }

    private DoLoginBackground(ShowWaitWindow: boolean) {
        return this.LoginService.DoLogin(
                this.AppParameter.UsuarioLogado.UserLogin,
                this.AppParameter.UsuarioLogado.UserPsw,
                this.AppParameter.UsuarioLogado.EmpresaNumero,
                this.AppParameter.UsuarioLogado.FilialNumero,
            ShowWaitWindow, false)
    }

    private VerificaConfirmacaoLogin(Error: IHttpError, Parameters: MQueryParameters) {
        //Se mesmo após o login, retornou status 401,
        //Então o usuario trocou a senha ou está desabilitado
        if (Error.Status == 401) {
            this.LoginService.OpenLoginConfirmation().then(() => {
                //Caso o login tenha sido confirmado,
                // realizamos novamente a consulta e continuamos com o processo
                this.ExecAfterLogin(Parameters, Observable);
            }).catch((Error) => {
                //Se caiu no catch, então o usuario voltou para o login
                let _Erro: IHttpError = {
                    Status: 401,
                    Stacktrace: null,
                    Mensagem: 'CFYLOGINSERVICE_ERROR_USUARIO_SEM_PERMISSAO',
                    ObjetoErro: Error
                };
                this.TratamentoErros(_Erro, Observable, Parameters)
            })
        }
        else
            this.TratamentoErros(Error, Observable, Parameters);
    }

    private ExecAfterLogin(Parameters: MQueryParameters, Observable) {
        let Parameter: any = {
            'Query': Parameters.Query,
            'QueryParameter': Parameters.Parameters,
            'SearchParameters': null
        };
        // Realizando a chamada para o servidor
        this.FacHttpService.Post("ExecQuery", Parameter, Parameters.ShowWaitWindow)
            .subscribe((Response: any) => {
                    Observable.next(Response ? Response.ResultSet : []);
                    Observable.complete();
                },
                (Error:IHttpError) => {
                    //Se veio uma mensagem de unautorized, então provavelmente a sessão expirou e tentaremos efetuar o login novamente
                    if (this.AppParameter.isLogged() && Error && Error.Status == 401) {
                        this.AppParameter.AutToken = null;
                        this.DoLoginBackground(Parameters.ShowWaitWindow).subscribe(() => {
                                //Se relogou com sucesso, então refaz a consulta
                                this.ExecAfterLogin(Parameters, Observable);
                            },
                            (Error: IHttpError) => {
                               this.VerificaConfirmacaoLogin(Error, Parameters);
                            });
                    }
                    else
                        this.TratamentoErros(Error, Observable, Parameters);

                });
    }

    private TratamentoErros(Erro: IHttpError, Observable, Parameters: MQueryParameters) {
        let _ErroMessage = Erro && Erro.Mensagem ? Erro.Mensagem : "Ocorreu um erro ao se conectar ao servidor remoto. Verifique sua conexão com a internet.";
        this.Log.LogError(`Ocorreu um erro ao realizar a consulta ${Parameters.Query}: ${_ErroMessage}`);
        //Logando o stacktrace
        if (Erro && Erro.Stacktrace)
            this.Log.Log(Erro.Stacktrace, 4, true);
        if (Parameters.ShowErrorMessage)
            this.Dialog.ShowConfirmation(_ErroMessage);
        Observable.error(Erro);
        Observable.complete();
    }

}
