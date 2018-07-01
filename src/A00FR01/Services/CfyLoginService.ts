/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Tipo        : Serviço                                                     ::
 ::  Descrição   : Serviço para realizar para realizar login na aplicação      ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Injectable} from '@angular/core';
import {CfyHttpService} from './CfyHttpService';
import {AppParameters} from './AppParameters';
import {UserParameter} from '../Interfaces/UserParameter';
import {catchError, map} from 'rxjs/operators';
import {CLog} from '../Handler/CLog';
import {throwError} from 'rxjs';
import {CfyDialog} from './CfyDialog';
import {IHttpError} from '../Interfaces/IHttpError';
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class CfyLoginService {

    constructor(private AppParameter: AppParameters,
                private Log: CLog,
                private Dialog: CfyDialog,
                private HttpService: CfyHttpService) {

    }

    DoLogin(UserName: string, Password: string, Empresa?, Filial?, Background: boolean = true, ShowError: boolean = true) {
        this.Log.Log(`Iniciando o login...`, 1);
        return this.HttpService.Post('LoginMobile', {
            'User': UserName,
            'Password': Password,
            'TpApp': this.AppParameter.Ambiente.TpApp,
            'Empresa': Empresa,
            'Filial': Filial
        }, !Background).pipe(
            // Mapeia o Response para enviar ao login
            catchError((Error: IHttpError) => {
                // Criar função para mostrar erro
                if (ShowError) {
                    const _Mensagem = Error.Mensagem || (Error.Status == 401 ? 'CFYLOGINSERVICE_ERROR_USUARIO_NAO_AUTENTICADO' : 'CFYLOGINSERVICE_ERROR_SERVIDOR_INDISPONIVEL');
                    this.Dialog.ShowErrorMessage(_Mensagem);
                }
                this.Log.Log(`Erro ao realizar o login: ${Error.Mensagem}. Status: ${Error.Status}: ${Error.ObjetoErro.statusText}`, 1, true);
                return <any> throwError(Error);
            }),
            map(Response => this.setUser(Response['return'], Password))
        );
    }

    /**
     * Abre a confirmação de login para verificar o novo usuario e senha
     * @returns {Promise<any>}
     * @constructor
     */
    OpenLoginConfirmation(): Promise<any> {
        return new Promise<any>((Resolve, Reject) => {
            /**
             * TODO
             * Tela de confirmação de login e senha
             */
            console.log("FAZER TELA DE CONFIRMAÇÃO DE LOGIN");
            Resolve();
        });
    }

    /**
     * Alteração de senha e email
     * @param {string} Email
     * @returns {Observable<any>}
     * @constructor
     */
    ChangePassword(Email: string): Observable<any> {
        this.Log.Log(`Pedido de recuperação de senha email ${Email}`, 1);
        return this.HttpService.Post('LoginServlet', {
            'Email': Email,
            'Action': '3'
        }).pipe(
            // Mapeia o Response para enviar ao login
            catchError((Error: IHttpError) => {
                // Criar função para mostrar erro
                const _Mensagem = Error.Mensagem || (Error.Status == 401 ? 'CFYLOGINSERVICE_ERROR_USUARIO_NAO_AUTENTICADO' : 'CFYLOGINSERVICE_ERROR_SERVIDOR_INDISPONIVEL');
                this.Dialog.ShowErrorMessage(_Mensagem);
                this.Log.Log(`Erro ao realizar o login: ${Error.Mensagem}. Status: ${Error.Status}: ${Error.ObjetoErro.statusText}`, 1, true);
                return <any> throwError(Error);
            })
        );
    }

    /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      ::  Faz a seleção na empresa e filial no servidor                             ::
      ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    setEmpresaFilial(NrEmpresa: number, NrFilial: number, ShowWaitWindow: boolean = true, ShowError: boolean = true) {
        this.Log.Log(`Setando empresa ${NrEmpresa} e filial ${NrFilial}`, 1);
        return this.HttpService.Post('BranchCompanyServlet', {
            'Action': "2",
            "NR_EMPRESA": NrEmpresa,
            "NR_FILIAL": NrFilial,
            'TpApp': this.AppParameter.Ambiente.TpApp,
        }, ShowWaitWindow).pipe(
            // Mapeia o Response para enviar ao login
            catchError((Error: IHttpError) => {
                // Criar função para mostrar erro
                if (ShowError) {
                    const _Mensagem = Error.Mensagem || (Error.Status == 401 ? 'CFYLOGINSERVICE_ERROR_USUARIO_NAO_AUTENTICADO' : 'CFYLOGINSERVICE_ERROR_SERVIDOR_INDISPONIVEL');
                    this.Dialog.ShowErrorMessage(_Mensagem);
                }
                this.Log.Log(`Erro ao realizar ao setar a empresa e filial: ${Error.Mensagem}. Status: ${Error.Status}: ${Error.ObjetoErro.statusText}`, 1, true);
                return <any> throwError(Error);
            }),
            map(Response => this.setUser(Response['return'], this.AppParameter.UsuarioLogado ? this.AppParameter.UsuarioLogado.UserPsw : null))
        );
    }

    private GoToLogin() {

    }

    private setUser(User: any, Password: string) {
        // Realizando os logs
        this.Log.Log(`Setando o usuario ${User.UserName}`, 1);
        let Empresas;
        const _User: UserParameter = new UserParameter();
        // Informações do usuario
        _User.AccessNumber = User.AccessNumber;
        _User.UserNr = User.UserNr;
        _User.UserLogin = User.UserLogin;
        _User.UserPsw = Password;
        _User.UserEmail = User.UserEmail;
        _User.UserName = User.UserName;
        // Caso não tenha numero de acesso, então precisa escolher uma filial
        if (_User.AccessNumber) {
            this.Log.Log(`Usuario possui uma empresa e filial: Setando Empresa ${User.CompanyBranch.CompanyDescription} e Filial ${User.CompanyBranch.BranchDescription}`, 1);
            _User.EmpresaNumero = User.CompanyBranch.CompanyNumber;
            _User.EmpresaNome = User.CompanyBranch.CompanyDescription;
            _User.EmpresaCNPJ = User.CompanyBranch.CompanyCNPJ;
            _User.EmpresaEndereco = User.CompanyBranch.CompanyAddress;
            _User.FilialNumero = User.CompanyBranch.BranchNumber;
            _User.FilialNome = User.CompanyBranch.BranchDescription;
            if (User.CompanyBranch.TransactionList) {
                this.Log.Log(`Transações permissões:`, 4);
                _User.TransactionList = User.CompanyBranch.TransactionList.map(
                    Elemento => {
                        this.Log.Log(`Transação: ${Elemento.Transaction}:`, 4);
                        return Elemento.Transaction;
                    });
                // Percorrendo o array
                /*UserParameter.CompanyBranch.TransactionList.forEach((Elemento) => {
                    //Criando a lista de transações
                    /!*let _Transaction: MTransaction = new MTransaction();
                    _Transaction.Nome = Elemento.Transaction;
                    _Transaction.PermissaoAcesso = Elemento.AccessPermition;*!/
                    _User.TransactionList.push(Elemento.Transaction);
                });*/
            }
            // Executando o callback do after login se parametrizado
            if (this.AppParameter.AfterLogin) {
                this.Log.Log(`Executando a função Pos Login`, 2);
                this.AppParameter.AfterLogin(_User);
            }
        }
        else {
            this.Log.Log(`Usuario possui multiplas Filiais`, 1);
            this.Log.Log(User.CompanyBranchList, 4);
            Empresas = User.CompanyBranchList;
        }
        this.AppParameter.UsuarioLogado = _User;
        return {
            User: _User,
            Empresas: Empresas
        };

    }
}
