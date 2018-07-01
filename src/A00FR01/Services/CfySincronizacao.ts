/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E00FR01 - Angular 2 Corp                                    ::
 ::  Arquivo     : FacSincronizacao.ts                                         ::
 ::  Tipo        : Service                                                     ::
 ::  Descrição   : Serviço de sincronização da aplicação                       ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Inject, Injectable} from "@angular/core";
import {ISincronizacao} from "../NoSQL/Interfaces/ISincronizacao";
import {Observable} from "rxjs";
import {CfyUtilServices} from "./CfyUtilServices";
import {AppParameters} from "./AppParameters";
import {CfyDialog} from "./CfyDialog";
import {CfyQueryService} from "./CfyQueryService";
import {CLog} from "../Handler/CLog";
import {SincronizacaoPage} from "../Pages/SincronizacaoPage/SincronizacaoPage";
import {MModalOptions} from "../Model/MModalOptions";
import {MQueryParameters} from "../Model/MQueryParameters";


@Injectable()
export class CfySincronizacao {

    private Sincronizing: boolean = false;

    constructor(private Util: CfyUtilServices,
                private Log: CLog,
                private AppParameter: AppParameters,
                private Dialog: CfyDialog,
                @Inject("ISincronizacao")
                private SincInterface: ISincronizacao,
                private RemoteExec: CfyQueryService) {

    }

    /*/!**
     * Inicia o escutador de mudan
     * @constructor
     *!/
    StartListenChanges() {
        if (this.DBReference)
            this.DBReference.off();
        //Se ainda não existe, faz a inicialização do firebase
        else {
            try {
                firebase.initializeApp(this.AppParameter.FireBaseConfFile);
            }
            catch (E) {
                this.Util.Log(E);
                return;
            }
        }
        //Recuperando a referencia
        this.DBReference = firebase.database().ref("Cloudfy/Empresa/").child(this.AppParameter.getUser().EmpresaNumero.toString());
        this.DBReference.on("value", (Valor) => {
            //Soh faz a sincronização se estiver no wifi
            if (!this.Sincronizing) {
                this.Sincronizing = true;
                this.Verificacao();
            }
        });
    }*/

    /**
     * Função que verifica se é a primeira sincronização
     * @returns {Promise<any>}
     * @constructor
     */
    PrimeiraSincronizacao(): Promise<any> {
        return new Promise<any>((Resolve, Reject) => {
            //Verificando se já foi realizada uma sincronização completa
            this.Log.Log("Verificando se já foi realizada uma sincronização", 2);
            this.SincInterface.VerificaPrimeiraSincronizacao().then((PrimeiraSincronizacao) => {
                //Se for a primeira sincronização, abre a tela principal para sincronizar
                if (!PrimeiraSincronizacao) {
                    this.Log.Log("Primeira sincronização identificada, abrindo tela de sincronização...");
                    const _Option = new MModalOptions();

                    _Option.Titulo = "SINCRONIZACAOPAGE_TITLE";
                    _Option.Fechar = false;
                    _Option.sknOnClose = (Sucesso) => {
                        Resolve(Sucesso);
                    },
                    _Option.ShowCloseButton = false;
                    this.Dialog.OpenModal(SincronizacaoPage, {FecharAoConcluir: true}, _Option);
                }
                //Se não é a primeira sincronização, então apenas resolvemos a promessa
                else {
                    this.Log.Log("Aplicação já foi sincronizada para esta empresa e filial");
                    Resolve(PrimeiraSincronizacao);
                    //Senão, inicializa o processo de sincronização
                    /*this.StartListenChanges();*/
                }

            }).catch(Error => {
                Reject(Error);
            });
        });
    }

    /**
     * Vai no servidor e verifica se existem novas atualizações
     * @param ShowWaitWindow
     * @param ShowErrorWindow
     * @returns {Promise<Array<any>>}
     * @constructor
     */
    VerificarSincronizacao(ShowWaitWindow?: boolean, ShowErrorWindow?: boolean): Promise<Array<any>> {
        return new Promise<Array<any>>((Resolve, Reject) => {
            const Remote: MQueryParameters = new MQueryParameters();
            Remote.NomeExecucaoRemota = "Corp/MobileGetTabelasSincronizacao";
            //Versão e tipo de ambiente = 3 - Electron
            Remote.Parameters = [this.AppParameter.Ambiente.DBVersion, 3, this.AppParameter.Ambiente.SystemPackage != null ? this.AppParameter.Ambiente.SystemPackage : ""];
            Remote.ShowWaitWindow = ShowWaitWindow == null ? false : ShowWaitWindow;
            Remote.ShowErrorMessage = ShowErrorWindow == null ? false : ShowErrorWindow;
            this.RemoteExec.Exec(Remote).subscribe((Resultado: Array<any>) => {
                if (Resultado && Resultado.length > 0)
                    this.SincInterface.VerificaItensParaSincronizar(Resultado).then(ResultSet => Resolve(ResultSet)).catch(Error => Reject(Error));
                else
                    Resolve();
            }, (Error) => {
                this.Log.LogError(Error);
                Reject(Error);
            });
        });
    }

    /**
     * Faz a Sincronização das tabelas no servidor
     * @param TabelasParaSincronizar
     * @param Infinito - Tenta sincronizar infinitamente
     * @returns {Observable<any>|"../../Observable".Observable<any>|"../../../Observable".Observable<any>}
     * @constructor
     */
    SincronizaTabelasServidor(TabelasParaSincronizar: Array<any>): Observable<any> {
        return new Observable<any>((Observer) => {
            const Options = this.AppParameter.ParametrosSincronizacao;
            //Dois contadores para sincronizar as requisições do servidor
            let _ContadorTabelasParaSincronizar = 0;
            if (TabelasParaSincronizar && TabelasParaSincronizar.length > 0) {
                for (let i = 0; i < TabelasParaSincronizar.length; i++) {
                    const _Tabela = TabelasParaSincronizar[i];
                    //Se tiver resultSet, então a versão está atualizada
                    const _ExecRemote: MQueryParameters = new MQueryParameters();
                    _ExecRemote.ShowErrorMessage = false;
                    _ExecRemote.ShowWaitWindow = false;
                    _ExecRemote.NomeExecucaoRemota = "Corp/MobileSincronizaTabelas";
                    /**
                     * Order dos parametros
                     * 1 - Numero da sincronização
                     * 2 - Versão do banco
                     * 3 - Parametros adicionais da consulta de sincronização - Envia o UUID do dispositivo
                     * 4 - Versão atual
                     */
                    _ExecRemote.Parameters = [_Tabela.XX933_NR_SINC, this.AppParameter.Ambiente.DBVersion, Options ? JSON.stringify(Options) : null, null];
                    this.Log.Log("Iniciando sincronização da tabela " + _Tabela.XX933_VC_TABELA);
                    //Informando a tela que a tabela iniciou a sincronização
                    Observer.next({"Tabela": _Tabela.XX933_VC_TABELA, Status: 1});
                    //Se passou infinito, então tentamos executar infinitamente
                    this.RemoteExec.Exec(_ExecRemote).subscribe((ResultSet: any) => {
                        //Nova versão
                        _Tabela.XX933_NR_VER = ResultSet.Version;
                        this.SincInterface.SincronizaTabela(_Tabela, ResultSet.ResultSet).then(() => {
                            _ContadorTabelasParaSincronizar++;
                            //Tabela sincronizada
                            Observer.next({
                                "Tabela": _Tabela.XX933_VC_TABELA,
                                Status: 3,
                                Linhas: ResultSet.ResultSet ? ResultSet.ResultSet.length : 0
                            });
                            this.Log.Log("Tabela " + _Tabela.XX933_VC_TABELA + " sincronizada com sucesso.");
                            this.VerificaFinalizacao(TabelasParaSincronizar.length, _ContadorTabelasParaSincronizar, Observer);
                        }).catch(Error => {
                            //Se der erro contabilizamos
                            this.Log.Log("Erro ao sincronizar a tabela " + _Tabela.XX933_VC_TABELA + ": " + Error.toString());
                            _ContadorTabelasParaSincronizar++;
                            Observer.next({"Tabela": _Tabela.XX933_VC_TABELA, Status: 2, Error: Error.toString()});
                            this.VerificaFinalizacao(TabelasParaSincronizar.length, _ContadorTabelasParaSincronizar, Observer);
                        });
                    }, (Error) => {
                        _ContadorTabelasParaSincronizar++;
                        Observer.next({"Tabela": _Tabela.XX933_VC_TABELA, Status: 2, Error: Error});
                        this.Log.Log("Erro ao sincronizar a tabela " + _Tabela.XX933_VC_TABELA + ": " + Error.toString());
                        this.VerificaFinalizacao(TabelasParaSincronizar.length, _ContadorTabelasParaSincronizar, Observer);
                    });
                }

            }
        });
    }

    private Verificacao() {

        //Aguarda 1 segundo para sincronizar
        setTimeout(() => {
            let _TemErros = false;
            this.Log.Log("Inicializando ciclo de sincronização...");
            this.VerificarSincronizacao(false, false).then((ResultSet) => {
                if (ResultSet && ResultSet.length) {
                    this.SincronizaTabelasServidor(ResultSet).subscribe((Result) => {
                        if (Result.Status == 3)
                            this.Log.Log("Processo de sincronização concluido.");
                        //Se tiver erros, sinalizamos no complete
                        else if (Result.Status == 2)
                            _TemErros = true;

                    }, (Error) => {
                        this.Log.LogError(Error);
                    }, () => {
                        if (_TemErros) {
                            //Aguarda 10s e tenta novamente
                            setTimeout(() => {
                                this.Verificacao();
                            }, 10000);
                        }
                        else
                            this.Sincronizing = false;
                    });
                }
                else
                    this.Sincronizing = false;
            }, (Error) => {
                //Se deu algum erro, espera 10s e tenta novamente
                setTimeout(() => {
                    this.Verificacao();
                }, 10000);
                this.Log.Log(Error);
            });
        }, 500);
    }

    /**
     * Faz a contagem para verificar se a operação já foi finalizada
     * @param Total
     * @param Atual
     * @param Observer
     * @constructor
     */
    private VerificaFinalizacao(Total, Atual, Observer) {
        if (Atual >= Total)
            Observer.complete();
    }
}
