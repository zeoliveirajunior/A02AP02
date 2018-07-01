/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E00FR01 - Corporativo Angular 2                             ::
 ::  Arquivo     : LoginPage.ts                                                ::
 ::  Tipo        : Page                                                        ::
 ::  Descrição   : Tela de login padrão                                        ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Component, Inject, Injector, NgModuleRef, NgZone, ViewChild} from "@angular/core";
import {CfyLoginService} from "../../../A00FR01/Services/CfyLoginService";
import {CfyPadroes} from "../../../A00FR01/Pages/Padroes/Padroes";
import {MModalOptions} from "../../../A00FR01/Model/MModalOptions";
import {UserParameter} from "../../../A00FR01/Interfaces/UserParameter";
import {IUser} from "../../../A00FR01/NoSQL/Interfaces/IUser";
import {ITela} from "../../../A00FR01/Interfaces/ITela";
import {ICaixa} from "../../SQL/Interface/ICaixa";
import {CfySincronizacao} from "../../../A00FR01/Services/CfySincronizacao";
import {CCParameters} from "../../Services/CCParameters";
import {CaixaPage} from "../Caixas/CaixaPage";
import {CLog} from "../../../A00FR01/Handler/CLog";


@Component({
    selector: "login-page",
    templateUrl: "./LoginPage.html"
})
export class LoginPage extends ITela {

    @ViewChild("UserInput")
    UserInput;

    @ViewChild("Form")
    Form;
    /**
     * Variavel indicando o modo
     */
    ChangePassword: boolean;

    constructor(private Injetor: Injector,
                private LoginService: CfyLoginService,
                @Inject("IUser")
                private UserSQLService: IUser,
                private Log: CLog,
                private Caixa: ICaixa,
                private CCParameter: CCParameters,
                private Zone: NgZone,
                private NgModRef: NgModuleRef<any>,
                private Sincronizacao: CfySincronizacao) {
        super(Injetor, "LoginPage");
        /* Criando os eventos de keyBind */
        this.OnKeyEvent().subscribe((E) => {
            if (E.keyCode == 13) {
                this.Zone.run(() => {
                    if (!this.ChangePassword)
                        this.Login();
                    else
                        this.TrocarSenha(this.Form.value.Email);
                });
            }
        });

    }


    Login() {
        if (!this.Form.value.UserName) {
            this.Dialog.ShowErrorNotification("LOGIN_PAGE_USUARIO_OBRIGATORIO");
            return;
        }
        if (!this.Form.value.Password) {
            this.Dialog.ShowErrorNotification("LOGIN_PAGE_SENHA_OBRIGATORIO");
            return;
        }
        //Tenta fazer o login local
        this.UserSQLService.Login(this.Form.value.UserName, this.Form.value.Password).then((Usuario: UserParameter) => {
            if (Usuario) {
                this.AppParameter.UsuarioLogado = Usuario;
                this.AfterLogin();
            }
        }).catch((Erro) => {
            this.Log.Log("Falha ao realizar o login localmente, realizando tentativa online...");
            //Recuperando o ultimo caixa logado
            this.Caixa.getUltimoCaixaLogado().then((Caixa) => {
                let _Empresa;
                let _Filial;
                if (Caixa) {
                    _Empresa = Caixa.CC003_NR_EMPRESA;
                    _Filial = Caixa.CC003_NR_FILIAL;
                }
                this.LoginServer(_Empresa, _Filial).then((User: UserParameter) => {
                    if (User)
                        this.AfterLogin();
                }).catch(Error => console.log("ocorreu erro no reject " + Error));
            });
        });
    }

    AfterLogin() {
        /**
         * Precisamos verificar se já existe caixa configurado
         */
        this.Caixa.getCaixaAtual().then(Caixa => {
            //Se ja existe um caixa, então apenas iniciamos a verificação de atrelamento de caixa
            if (Caixa) {
                //Setando o caixa localmente
                this.SetarCaixa(Caixa);
            }
            //Se não existir então temos que buscar os caixas disponiveis
            else {
                this.Caixa.getCaixasDisponiveis().subscribe((Resultado) => {
                    if (Resultado) {
                        //se o resultado da operação for 1, então apenas setamos o caixa
                        if (Resultado.Operacao == 1)
                            this.SetarCaixa(Resultado.Result, true);
                        //Se for 2, então temos que abrir a tela de seleção de caixa
                        else {
                            //Abre uma tela modal com a seleção de caixas
                            const _Opt: MModalOptions = new MModalOptions();
                            _Opt.sknOnClose = (CaixaPar) => {
                                //Se retornou com o caixa, então setamos o caixa
                                if (CaixaPar)
                                    this.SetarCaixa(CaixaPar, true);
                            };
                             _Opt.Fechar = false;
                             _Opt.ShowCloseButton = false;
                             _Opt.Titulo = "CAIXAS_TITLE";
                            _Opt.FactoryInstance = this.NgModRef;
                            this.Dialog.OpenModal(CaixaPage, {
                                ResultSet:  Resultado.Result
                            }, _Opt);
                        }
                    }
                });
            }
        });
    }

    /**
     * Setando o caixa
     * @param Caixa
     * @constructor
     */
    SetarCaixa(Caixa, SalvarOnline?: boolean) {
        //Setando o caixa nos parametros da aplicação
        this.CCParameter.Caixa = Caixa;
        //Parametros de sincronização
        this.AppParameter.ParametrosSincronizacao = {
            NrCaixa: Caixa.CC003_NR_CAIXA
        };
        //Salvando o caixa local
        this.Caixa.SalvarCaixa(Caixa, SalvarOnline).subscribe(() => {
            //Após salvar o caixa tenta fazer a primeira sincronização
            this.Sincronizacao.PrimeiraSincronizacao().then((Sucesso) => {
                if (Sucesso)
                    this.Dialog.ShowNotification("Login realizado com sucesso");
                    /*this.RouterService.navigate(["/app"])*/
            });
        });

    }

    TrocarSenha(Email) {
        if (!Email) {
            this.Dialog.ShowErrorNotification("LOGIN_PAGE_EMAIL_OBRIGATORIO");
            return;
        }
        this.LoginService.ChangePassword(Email).subscribe(Result => {
            this.Dialog.ShowNotification("LOGIN_PAGE_TROCA_SENHA_SUCESSO");
            this.ChangePassword = false;
            return;
        });
    }

    AfterInit() {
        //Focando no input
        this.UserInput.nativeElement.focus();
    }

    Init() {
    }

    OnDestroy() {
    }

    private LoginServer(EmpresaParameter, FilialParameter): Promise<UserParameter> {
        return new Promise<UserParameter>((Resolve, Reject) => {
            this.LoginService.DoLogin(this.Form.value.UserName, this.Form.value.Password, EmpresaParameter, FilialParameter, false, true).subscribe((User) => {
                    if (User.Empresas && User.Empresas.length) {
                        const _Opcoes = new MModalOptions();
                        _Opcoes.sknOnClose = (Filial) => {
                            if (!Filial) {
                                Resolve();
                                return;
                            }
                            //Setando a empresa e a filial
                            this.LoginService.setEmpresaFilial(Filial.CompanyNumber, Filial.BranchNumber).subscribe((UserLogin) => {
                                    Resolve(UserLogin.User);
                                },
                                (Error) => {
                                    Reject(Error);
                                }
                            );
                        };
                        _Opcoes.Titulo = "CFYPADROES_TITLE";
                        _Opcoes.ShowCloseButton = false;
                        this.Dialog.OpenModal(CfyPadroes, User.Empresas, _Opcoes);
                    }
                    //Se só veio um usuario, faz o login normalmente
                    else
                        Resolve(User.User);
                },
                (Error) => {
                    Reject(Error);
                });
        });
    }


}
