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

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {MQueryParameters} from './../Model/MQueryParameters';
import {AppParameters} from './AppParameters';
import {CfyLoginService} from './CfyLoginService';
import {CfyDialog} from './CfyDialog';
import {CfyHttpService} from './CfyHttpService';
import {CLog} from '../Handler/CLog';
import {IHttpError} from '../Interfaces/IHttpError';
import {CfyUtilServices} from "./CfyUtilServices";


/*
 Funcionalidades de modal e notificações
 */
@Injectable()
export class CfyQueryService {

    // Injeção de dependencias
    constructor(private AppParameter: AppParameters,
                private Log: CLog,
                private LoginService: CfyLoginService,
                private Dialog: CfyDialog,
                private Util: CfyUtilServices,
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
                const _Error: IHttpError = {
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
            ShowWaitWindow, false);
    }

    private VerificaConfirmacaoLogin(Error: IHttpError, Parameters: MQueryParameters) {
        //Se mesmo após o login, retornou status 401,
        //Então o usuario trocou a senha ou está desabilitado
        if (Error.Status == 401) {
            this.LoginService.OpenLoginConfirmation().then(() => {
                //Caso o login tenha sido confirmado,
                // realizamos novamente a consulta e continuamos com o processo
                this.ExecAfterLogin(Parameters, Observable);
            }).catch((Erro) => {
                //Se caiu no catch, então o usuario voltou para o login
                const _Erro: IHttpError = {
                    Status: 401,
                    Stacktrace: null,
                    Mensagem: 'CFYLOGINSERVICE_ERROR_USUARIO_SEM_PERMISSAO',
                    ObjetoErro: Erro
                };
                this.TratamentoErros(_Erro, Observable, Parameters);
            });
        }
        else
            this.TratamentoErros(Error, Observable, Parameters);
    }

    private ExecAfterLogin(Parameters: MQueryParameters, ObservableObj) {
        //Verificando se é uma query
        let _Url;
        let Parameter: any;
        //Tipo de consulta
        if (Parameters.Query) {
            Parameter = {
                'Query': Parameters.Query,
                'QueryParameter': Parameters.Parameters,
                'SearchParameters': null
            };
            _Url = "ExecQuery";
        }
        //Senão é execucao remota
        else {
            let _TempArray;
            /* Contendo os parametros em string */
            if (Parameters.Parameters) {
                _TempArray = [];
                if (this.Util.isArray(Parameters.Parameters)) {
                    Parameters.Parameters.forEach((Elemento) => {
                        if (Elemento == null)
                            _TempArray.push(null);
                        //Se for objeto converte para json
                        else if (this.Util.isObject(Elemento))
                            _TempArray.push(this.Util.toJson(Elemento));
                        else
                            _TempArray.push(Elemento.toString());
                    });
                }
                else
                    _TempArray.push(Parameters.Parameters.toString());


            }
            Parameter = {
                'FileName': Parameters.NomeExecucaoRemota,
                'Parameters': _TempArray
            };
            _Url = "ExecRMI";
        }
        // Realizando a chamada para o servidor
        this.FacHttpService.Post(_Url, Parameter, Parameters.ShowWaitWindow).subscribe((Response: any) => {
                ObservableObj.next(Response ? Response.ResultSet || Response.return : []);
                ObservableObj.complete();
            },
            (Erro: IHttpError) => {
                //Se veio uma mensagem de unautorized, então provavelmente a sessão expirou e tentaremos efetuar o login novamente
                if (this.AppParameter.isLogged() && Erro && Erro.Status == 401) {
                    this.AppParameter.AutToken = null;
                    this.DoLoginBackground(Parameters.ShowWaitWindow).subscribe(() => {
                            //Se relogou com sucesso, então refaz a consulta
                            this.ExecAfterLogin(Parameters, ObservableObj);
                        },
                        (Error: IHttpError) => {
                            this.VerificaConfirmacaoLogin(Error, Parameters);
                        });
                }
                else
                    this.TratamentoErros(Erro, ObservableObj, Parameters);

            });
    }

    private TratamentoErros(Erro: IHttpError, ObservableObj, Parameters: MQueryParameters) {
        const _ErroMessage = Erro && Erro.Mensagem ? Erro.Mensagem : 'Ocorreu um erro ao se conectar ao servidor remoto. Verifique sua conexão com a internet.';
        this.Log.LogError(`Ocorreu um erro ao realizar a consulta ${Parameters.Query}: ${_ErroMessage}`);
        //Logando o stacktrace
        if (Erro && Erro.Stacktrace)
            this.Log.Log(Erro.Stacktrace, 4, true);
        if (Parameters.ShowErrorMessage)
            this.Dialog.ShowConfirmation(_ErroMessage);
        ObservableObj.error(Erro);
        ObservableObj.complete();
    }

}
