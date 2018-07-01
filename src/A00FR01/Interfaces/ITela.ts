/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 2 corporativo                             ::
 ::  Tipo        : Interface                                                   ::
 ::  Descrição   : Classe abstrata representando as funcoes de tela            ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {AfterViewInit, Injector, OnDestroy, OnInit} from "@angular/core";
import {Observable, Observer} from "rxjs";
import {AppParameters} from "../Services/AppParameters";
import {CfyDialog} from "../Services/CfyDialog";

export abstract class ITela implements OnInit, AfterViewInit, OnDestroy {

    /**
     * Nome da tela ativa
     */
    Tela: string;
    AppParameter: AppParameters;
    Dialog: CfyDialog;
    /* Modal Id para fechar*/
    ModalId: string;

    /**
     * Observers de instancia
     */
    private ObserverKey;
    private RegisterOnKey: Observable<any>;
    private OnKeyObserver: Observer<any>;


    constructor(private InjectorService: Injector, Tela: string) {
        this.Tela = Tela;
        this.AppParameter = InjectorService.get(AppParameters);
        this.Dialog = InjectorService.get(CfyDialog);
    }

    /**
     * Eventos da tela
     * @returns {Observable<any>|"../../Observable".Observable<any>|"../../../Observable".Observable<any>}
     * @constructor
     */
    OnKeyEvent(): Observable<any> {
        if (!this.RegisterOnKey) {
            this.RegisterOnKey = new Observable<any>((ObserverObject) => {
                this.OnKeyObserver = ObserverObject;
                this.ObserverKey = this.AppParameter.RegisterForKeyEvents().subscribe((E) => {
                    if (this.AppParameter.EnableKeyEvent
                        && this.AppParameter.getTelaAtual() == this.Tela)
                        ObserverObject.next(E);

                });
            });
        }
        return this.RegisterOnKey;
    }

    abstract Init();

    abstract AfterInit();

    abstract OnDestroy();

    /**
     * Fecha uma tela modal
     * @constructor
     */
    FecharModal(Parametros?: any) {
        if (this.ModalId)
            this.Dialog.CloseModal(this.ModalId, Parametros);
    }

    ngOnInit(): void {
        //Adiciona a tela atual no array de telas
        this.AppParameter.setTelaAtual(this.Tela);
        //Chamando o método de inicialização
        this.Init();
    }

    ngAfterViewInit(): void {
        this.AfterInit();
    }

    ngOnDestroy(): void {
        //Limpando os observers
        if (this.ObserverKey) {
            this.OnKeyObserver.complete();
            this.OnKeyObserver = null;
            this.RegisterOnKey = null;
            this.ObserverKey.unsubscribe();
            this.ObserverKey = null;
        }
        this.AppParameter.RemoveTela(this.Tela);
        this.OnDestroy();
        this.Tela = null;
        this.AppParameter = null;
        this.Dialog = null;
    }


}
