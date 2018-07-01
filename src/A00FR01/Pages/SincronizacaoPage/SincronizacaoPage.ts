/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E00FR01 - Angular 2 corporativo                             ::
 ::  Arquivo     : SincronizacaoPage.ts                                        ::
 ::  Tipo        : Page                                                        ::
 ::  Descrição   : Tela de sincronização                                       ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


import {Component, forwardRef, Inject, Injector, NgZone} from "@angular/core";


import {ITela} from "../../Interfaces/ITela";

import {ISincronizacao} from "../../NoSQL/Interfaces/ISincronizacao";
import {CfySincronizacao} from "../../Services/CfySincronizacao";
import {CfyParams} from "../../Services/CfyParams";


@Component({
    selector: 'sincronizacao-page',
    templateUrl: 'SincronizacaoPage.html',
    styleUrls: ["SincronizacaoPage.css"]
})
export class SincronizacaoPage extends ITela {

    Parametros: any;
    RegistrosOK: Array<any>;
    RegistrosNOK: Array<any>;
    Finalizado: boolean = false;
    TentarNovamente: boolean = false;
    Erros: number = 0;
    ParamErros: any;

    constructor(Injetor: Injector,
                private Params: CfyParams,
                private Zone: NgZone,
                @Inject("ISincronizacao")
                private SincInterface: ISincronizacao,
                @Inject(forwardRef(() => CfySincronizacao))
                private Sincronizacao: CfySincronizacao) {
        super(Injetor, "Sincronizacao");
        //Recuperando os parametros da tela anterior
        this.Parametros = this.Params.get();
        /* Eventos de keyBind */
        this.OnKeyEvent().subscribe((E) => {
            //ESC
            if (E.keyCode == 27 && this.Finalizado)
                this.FecharModal(this.Erros == 0);

        });
    }

    Init() {
        this.Sincronizar();
    }

    /**
     * Faz a sincronização novamente dos dados
     * @constructor
     */
    Sincronizar() {
        this.RegistrosOK = [];
        this.RegistrosNOK = [];
        this.Erros = 0;
        this.Finalizado = false;
        this.Sincronizacao.VerificarSincronizacao(false).then((ResultSet) => {
            //Se não tiver resultSet, setamos a String
            if (!ResultSet || ResultSet.length == 0)
                this.Finalizado = true;
            this.Sincronizacao.SincronizaTabelasServidor(ResultSet).subscribe((Retorno) => {
                const _NomeTabela = Retorno.Tabela;
                const _Status = Retorno.Status;
                //Iniciando a sincronização
                if (_Status == 1) {
                    this.RegistrosNOK.push({
                        XX933_VC_TABELA: _NomeTabela
                    });
                }
                //Status 2 = erro e status 3 = finalizado com sucesso
                else {
                    this.Zone.run(() => {
                        //Procura pelo objeto no resultSet antigo;
                        for (let i = 0; i < this.RegistrosNOK.length; i++) {
                            if (this.RegistrosNOK[i].XX933_VC_TABELA == _NomeTabela) {
                                const _ObjetoAtual = this.RegistrosNOK[i];
                                //Verificando as linhas
                                _ObjetoAtual.Linhas = Retorno.Linhas != null ? Retorno.Linhas + " Registro(s)" : null;
                                //Verificando erros
                                _ObjetoAtual.Error = Retorno.Error != null ? Retorno.Error.toString() : null;
                                this.RegistrosOK.push(_ObjetoAtual);
                                //Remove o elemento do pending
                                this.RegistrosNOK.splice(i, 1);
                                //Totalizando os erros
                                this.Erros += Retorno.Error ? 1 : 0;
                                return;
                            }
                        }
                    });
                }
            }, (Error) => {
            }, () => {
                //Roda quando a operação finalizar
                this.Finalizado = true;
                //Se não houve erros, fechamos a tela e continuamos para a tela principal
                if (this.Erros == 0) {
                    this.SincInterface.SalvaSincronizacao().then(() => {
                        //Se veio a requisição para fechar a tela, então fechamos
                        /*if (this.Parametros.FecharAoConcluir)
                            this.FecharModal(true);*/
                    }).catch((Error) => {
                        if (this.Parametros.FecharAoConcluir)
                            this.FecharModal(true);
                    });
                }
                else {
                    //Setando os parametros de erros
                    this.ParamErros = {
                        "Erros": this.Erros
                    };
                }
            });
        }).catch(Error => {
            this.Finalizado = true;
            this.Erros = 1;
            //Setando os parametros de erros
            this.ParamErros = {
                "Erros": this.Erros
            };
            this.Dialog.GenerateError(Error);
        });

    }

    AfterInit() {

    }

    OnDestroy() {
        //Limpando as variaveis
        this.Parametros = null;
    }


}
