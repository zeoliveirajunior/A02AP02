/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 2 Corporativo                             ::
 ::  Tipo        : Component                                                   ::
 ::  Descrição   : Componente utilizado para representar um modal              ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 29/06/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {
    AfterViewInit,
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    NgModuleRef,
    OnDestroy,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {MModalOptions} from '../../Model/MModalOptions';
import {CfyDialog} from '../../Services/CfyDialog';
import {CfyUtilServices} from '../../Services/CfyUtilServices';
import {CLog} from '../../Handler/CLog';
import {CfyParams} from "../../Services/CfyParams";
import {AppParameters} from "../../Services/AppParameters";

declare var $;

@Component({
    selector: 'com-modal',
    templateUrl: 'ComModal.html'
})
export class ComModal implements AfterViewInit, OnDestroy {

    /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
     ::  VARIAVEIS INTERNAS                                                        ::
     ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    Id: string;
    /* Serviço de dialog (injeção nao funciona aqui por causa da recurção de injeção*/
    Dialog: CfyDialog;

    @ViewChild('Template', {read: ViewContainerRef})
    Container: ViewContainerRef;

    /* Componente da tela para abrir */
    sknTemplate: any;

    /**
     * Mensagem para exibir na tela
     */
    sknMessage: string;

    /* Parametros para a tela pai*/
    sknParam: any;

    /**
     * Evento chamado quando a tela fecha
     */
    sknOnClose: (Parameter) => void;
    /**
     * Parametros quando fechar a tela
     */
    sknCloseParam: any;

    /**
     * Opções da tela
     */
    sknOptions: MModalOptions;

    /**
     * Referencia do jquery
     */
    JqueryReferencia: any;

    /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
     ::  VARIAVEIS DA TELA INTERNA                                                 ::
     ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    // Titulo
    sknTitle: any;
    // Mostra o botão fechar
    sknShowCloseButton: any;
    // Permite multiplos modais
    sknMultipleModal: any;
    // Botões abaixo
    sknBtnBottom: any;

    sknNgModuloFactory: NgModuleRef<any>;

    constructor(private ComponentFactoryR: ComponentFactoryResolver,
                private Log: CLog,
                private Params: CfyParams,
                private AppParameter: AppParameters,
                private Util: CfyUtilServices) {
        // Gerando um Id unico para o modal
        this.Id = Util.GenerateUUID();
    }

    /**
     * Inicialização do componente
     */
    ngAfterViewInit(): void {
        //Id para o JQuery do bootstrap
        const _Id = '#' + this.Id;
        this.JqueryReferencia = $(_Id);
        //Retirando o focus de tudo
        if ('activeElement' in document)
            $(document.activeElement).blur();
        /* Evento de Hide do modal */
        this.Params.set(this.sknParam);
        this.CriarTemplate();
        this.JqueryReferencia.on('show.bs.modal', () => {
            this.AlterandoOpcoes();
        });
        this.JqueryReferencia.modal({
            backdrop: !this.sknOptions.Fechar ? 'static' : true,
            keyboard: this.sknOptions.Fechar,
            show: true,
            attentionAnimation: this.sknOptions.Fechar,
        });
        this.JqueryReferencia.on('hidden.bs.modal', () => {
            $(this).data('bs.modal', null);
            this.Dialog.CloseModalCorporativo(this.Id);
        });
    }

    AlterandoOpcoes() {
        setTimeout(() => {
            //Options
            if (this.sknOptions) {
                //Setando o titulo
                this.sknTitle = this.sknOptions.Titulo || this.AppParameter.Ambiente.SystemName;
                //Botão fechar
                this.sknShowCloseButton = this.sknOptions.ShowCloseButton;
                //Multiplos modais
                this.sknMultipleModal = this.sknOptions.MultipleModal;
                //FecharTela
                const _Fechar = this.sknOptions.Fechar == undefined ? true : this.sknOptions.Fechar;
                if (!_Fechar)
                    this.sknShowCloseButton = false;
                /**
                 * Botoes - Exemplo:
                 * [{
             *    Texto: "OK",
             *    OnClick: (FecharBotao) {
             *
             *    },
             *    Class: ["red"]
             * }]
                 */
                this.sknBtnBottom = this.sknOptions.Botoes && this.sknOptions.Botoes instanceof Array ? this.sknOptions.Botoes : null;


                if (this.sknOptions.OnKeyPress) {
                    /**
                     * Setando eventos de KeyPress
                     */
                    this.JqueryReferencia.on('keydown', (E) => {
                        const _Key = E.which || E.keyCode;
                        //Se pressionou o enter
                        this.sknOptions.OnKeyPress(E);
                    });
                }


            }
            //Se não tiver opções, deixa as default mesmo
            else {
                this.sknTitle = this.AppParameter.Ambiente.SystemName;
                this.sknShowCloseButton = true;
                //Multiplos modais
                this.sknMultipleModal = true;
            }
        });

    }

    /**
     * Evento de click dos botoes inferiores
     * @param Botao
     * @constructor
     */
    OnClickBtnAction(Botao) {
        //Se passou o botão
        if (Botao.OnClick)
            Botao.OnClick();
        //Forçando o fechamento
        if (Botao.Close)
            this.FecharTela();
    }

    /**
     * Força o fechamento da tela
     * @constructor
     */
    FecharTela() {
        this.JqueryReferencia.modal('hide');
    }

    /**
     * Compilando e gerando o template
     * @constructor
     */
    CriarTemplate() {
        if (this.sknTemplate) {
            /* hack para não ocorrer duplo dirty check*/
            setTimeout(() => {
                //Criando o template do componente
                const _FactoryTelaModal: ComponentFactory<any> = this.sknNgModuloFactory ?
                    this.sknNgModuloFactory.componentFactoryResolver.resolveComponentFactory(this.sknTemplate) : this.ComponentFactoryR.resolveComponentFactory(this.sknTemplate);
                //Limpando o container
                this.Container.clear();
                this.sknTemplate = this.Container.createComponent(_FactoryTelaModal);
                //Adicionando o IdModal para o metodo fechar da classe ITela
                this.sknTemplate.instance.ModalId = this.Id;
            });
        }
    }


    ngOnDestroy(): void {
        try {
            this.Dialog = null;
            this.sknParam = null;
            this.sknOnClose = null;
            this.sknCloseParam = null;
            this.sknOptions = null;
            if (this.sknTemplate)
                this.sknTemplate.destroy();
            this.sknTemplate = null;
            this.JqueryReferencia.modal('hide').data('bs.modal', null);
        }
        catch (E) {
            this.Log.LogError(E);
        }
    }

}
