/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A02AP01 - Cloud commerce PDV                                ::
 ::  Tipo        : Interface                                                   ::
 ::  Descrição   : Interface de configuração e consulta de caixa               ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


import {Observable} from "rxjs";
import {CfyQueryService} from "../../../A00FR01/Services/CfyQueryService";
import {CfyDialog} from "../../../A00FR01/Services/CfyDialog";
import {CfyUtilServices} from "../../../A00FR01/Services/CfyUtilServices";
import {IUser} from "../../../A00FR01/NoSQL/Interfaces/IUser";
import {MQueryParameters} from "../../../A00FR01/Model/MQueryParameters";
import {retryWhen} from "rxjs/operators";


export abstract class ICaixa {

    ExecRemote: CfyQueryService;
    Dialog: CfyDialog;
    Util: CfyUtilServices;
    UserInterface: IUser;


    constructor(ExecRemote: CfyQueryService,
                Dialog: CfyDialog,
                Util: CfyUtilServices,
                UserInterface: IUser) {
        this.ExecRemote = ExecRemote;
        this.Dialog = Dialog;
        this.Util = Util;
        this.UserInterface = UserInterface;
    }

    abstract getCaixaAtual(): Promise<any>;

    abstract SalvarCaixa(Caixa, SalvarOnline?: boolean): Observable<any>;

    abstract getUltimoCaixaLogado();


    /**
     * Recupera os caixas disponiveis na WEB
     * @returns {Observable<any>|"../../Observable".Observable<any>|"../../../Observable".Observable<any>}
     */
    getCaixasDisponiveis(): Observable<any> {
        return new Observable<any>(ObserverObj => {
            const _RemotePar: MQueryParameters = new MQueryParameters();
            _RemotePar.NomeExecucaoRemota = "H02SF0105A/getCaixas";
            this.ExecRemote.Exec(_RemotePar).subscribe((ResultSet) => {
                    //Verificando se existe algum caixa disponivel
                    if (!ResultSet || ResultSet.length == 0) {
                        ObserverObj.complete();
                        this.Dialog.ShowErrorMessage("CAIXAS_TODOS_OS_CAIXAS_ATRELADOS");
                        //Limpa o usuario da base local para resincronizar
                        this.UserInterface.DeletaUsuarioLogado().then(() => {}).catch((Error) => {});
                    }
                    else {
                        //Recuperando o UUID da maquina
                        const _UUID = this.Util.getMachineUUID();
                        //Caixas disponiveis
                        let _CaixasDisponiveis = [];
                        //Se existirem caixas, então verificamos se algum está já atrelado a esta maquina
                        for (let i = 0; i < ResultSet.length; i++) {
                            //Encontrou o caixa atrelado
                            if (ResultSet[i].CC003_VC_IDEQUIP == _UUID) {
                                //Se encontrou, orientamos a tela de login para salvar o novo caixa
                                ObserverObj.next({
                                    //Operacao 1 - Encontrou o caixa
                                    Operacao: 1,
                                    Result: ResultSet[i]
                                });
                                ObserverObj.complete();
                                return;
                            }
                            //Se não tiver nenhum caixa atrelado, então colocamos no array
                            else if (!ResultSet[i].CC003_VC_IDEQUIP) {
                                _CaixasDisponiveis.push(ResultSet[i]);
                            }
                        }

                        //Se não teve nenhum caixa disponivel, exibe a mensagem de caixas indisponiveis
                        if (_CaixasDisponiveis.length == 0) {
                            _CaixasDisponiveis = null;
                            ObserverObj.complete();
                            this.Dialog.ShowErrorMessage("CAIXAS_TODOS_OS_CAIXAS_ATRELADOS");
                            //Limpa o usuario da base local para resincronizar
                            this.UserInterface.DeletaUsuarioLogado().then(() => {}).catch((Error) => {});
                        }
                        //Senão, devolvemos os caixas disponiveis
                        else {
                            ObserverObj.next({
                                //Operacao 2 - Abrir tela para selecionar o caixa
                                Operacao: 2,
                                Result: _CaixasDisponiveis
                            });
                            ObserverObj.complete();
                        }
                    }
                },
                () => {
                    ObserverObj.complete();
                    //this.Dialog.GenerateError(Error);
                }
            );
        });
    }

    /**
     * Faz a Atualização do caixa online
     * @constructor
     */
    AtualizarCaixaOnline(Caixa): Observable<any> {
        return new Observable<any>((Observer) => {
            const _ExecParameter: MQueryParameters = new MQueryParameters();
            _ExecParameter.ShowErrorMessage = false;
            _ExecParameter.ShowWaitWindow = false;
            _ExecParameter.NomeExecucaoRemota = "H02SF0105A/updateCaixa";
            _ExecParameter.Parameters = [Caixa.CC003_NR_CAIXA, this.Util.getMachineUUID()];
            //Tenta sincronizar o caixa por 60s no maximo, com intervalo de 5000 segundos entre as tentativas
            this.ExecRemote.Exec(_ExecParameter).
                pipe(
                    retryWhen(Error => (<any> Error).delay(2000).take(10))
                )
            .subscribe((Result) => {
                Observer.next();
                Observer.complete();
            }, (Error) => {
                Observer.complete();
            });
        });
    }
}
