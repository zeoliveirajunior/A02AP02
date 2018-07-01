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

import {ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable} from '@angular/core';
import {AppParameters} from './AppParameters';
import {TranslateService} from '@ngx-translate/core';
import {CLog} from '../Handler/CLog';
import {CfyUtilServices} from './CfyUtilServices';
import {ComModal} from '../Components/ComModal/ComModal';
import {MModalOptions} from "../Model/MModalOptions";


/**
 * Variaveis de plugin JQuery
 */
declare var $: any;

declare var mApp: any;

declare var toastr: any;

declare var swal: any;

@Injectable()
export class CfyDialog {

    /* Pilha com as telas modais */
    TelasModais: any = {};

    TelaModalAtual: ComponentRef<ComModal>;

    constructor(private AppParameter: AppParameters,
                private ComponentFactoryR: ComponentFactoryResolver,
                private Util: CfyUtilServices,
                private Log: CLog) {

    }

    ShowWaitWindow(Mensagem: string) {
        if (!Mensagem)
            Mensagem = 'FACDIALOG_SHOW_WAIT_DEFAULT_MESSAGE';
        Mensagem = this.Util.GetTranslation(Mensagem);
        this.AppParameter.EnableKeyEvent = false;
        /*const _Configuracao = {
            message: `<h3 style="color:#fff">${Mensagem}</h3>
                 <div class="blockUI blockMsg blockElement"
                     style="z-index: 1011; position: relative; padding: 0px; margin-right: auto;margin-left: auto; width: 30%; text-align: center; color: rgb(0, 0, 0); border: 0px; cursor: wait;">
                    <div class="loading-message ">
                        <div class="block-spinner-bar">
                            <div class="bounce1" style="background: #3598dc"></div>
                            <div class="bounce2" style="background: #3598dc"></div>
                            <div class="bounce3" style="background: #3598dc"></div>
                        </div>
                    </div>
                </div>
                `,
            animate: true,
            css: {border: '0px', color: '#fff', backgroundColor: 'transparent', 'z-index': 60000},
            overlayCSS: {
                'z-index': 60000,
            },
        };*/
        //$.blockUI(_Configuracao);
        mApp.blockPage({
            overlayColor: '#000000',
            type: 'loader',
            state: 'success',
            message: Mensagem
        });
        this.Log.Log(Mensagem, 4);

    }

    HideWaitWindow() {
        mApp.unblockPage();
        //$.unblockUI();
        setTimeout(() => {
            this.AppParameter.EnableKeyEvent = true;
        });
    }

    /**
     * Mostra uma mensagem de erro para o usuario
     * @param Mensagem
     * @param Titulo
     * @constructor
     */
    public ShowErrorMessage(Mensagem: string, Titulo?: string) {
        this.ShowConfirmation(Mensagem, Titulo, 'error');
    }

    public ShowErrorNotification(Notification: string, Titulo?: string) {
        this.ShowNotification(Notification, Titulo, 'error');
    }

    public ShowWarningNotification(Notification: string, Titulo?: string) {
        this.ShowNotification(Notification, Titulo, 'warning');
    }

    // Exibe uma notificação na tela
    public ShowNotification(Notification: string, Titulo?: string, Tipo?: string, Position?: string) {
        toastr.options = {
            'closeButton': true,
            'debug': false,
            'newestOnTop': false,
            'progressBar': false,
            'positionClass': Position || 'toast-top-center',
            'preventDuplicates': false,
            'onclick': null,
            'showDuration': '300',
            'hideDuration': '1000',
            'timeOut': '5000',
            'extendedTimeOut': '1000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };
        toastr[Tipo ? Tipo : 'success'](this.Util.GetTranslation(Notification), Titulo);
        /*Position = Position ? Position : 'top';
         this.Util.GetTranslation(Notification).subscribe((Value: string) => {
         let _Nofitication = this.NotificationController.create({
         // Mensagem
         message: Value,
         // duração
         duration: 5000,
         position: Position,
         showCloseButton: true,
         closeButtonText: 'Ok'
         });
         _Nofitication.present();
         });*/
    }

    /**
     * Mostra uma mensagem de confirmação
     * @param Message
     * @param Title
     * @param Callback
     * @constructor
     */
    public ShowConfirmation(Message: string, Title?: string, Icone?: string, Callback?: () => void) {
        setTimeout(() => {
            this.AppParameter.EnableKeyEvent = false;
            swal({
                title: this.Util.GetTranslation(Message),
                text: this.Util.GetTranslation(Title || this.AppParameter.Ambiente.SystemName),
                type: Icone ? Icone : 'success',
                showConfirmButton: true,
                onClose: () => {
                    setTimeout(() => {
                        //Timeout para debounce
                        this.AppParameter.EnableKeyEvent = true;
                        if (Callback)
                            Callback();
                    }, 400);

                }
                /*O Catch roda quando o usuario pressiona a tecla esq */
            }).catch(Errors => {
                this.Log.LogError(Errors);
            });
        }, 100);

        //Restaura o timer, devido ao bug do confirm não ser chamado as vezes
    }

    /**
     * Abre uma janela modal
     * @param Tela - Tela para ser aberta
     * @param Parameter - Parametros
     * @param Options - Opções de abertura da tela
     * Titulo : Titulo da tela modal - Default - Nome da aplicação
     * ShowCloseButton : Exibe o botão fechar default da tela. Default: true
     * MultipleModal : Permite multiplas modais: Default: true
     * sknOnClose : Função chamada quando a tela fechar
     * Botoes : Array com os botoes {
     *      Texto: Texto do botão
     *      OnClick: Função chamada no evento do click
     *      Class: Array com as classes CSS
     *  }
     *  Fechar: Permite fechar a tela com ESC e clicando fora. Default: true
     * @returns {string}
     * @constructor
     */
    public OpenModal(Tela, Parameter?: any, Options?: MModalOptions): string {
        if (!this.AppParameter.ContainerPrincipal) {
            this.ShowErrorMessage("Container principal não carregado. A funcionalidade de modal será desabilitada");
            return;
        }
        const _FactoryTelaModal: ComponentFactory<ComModal> = this.ComponentFactoryR.resolveComponentFactory(ComModal);
        const _TelaModal = this.AppParameter.ContainerPrincipal.createComponent(_FactoryTelaModal, this.AppParameter.ContainerPrincipal.length);
        //Se for uma string adiciona apenas a mensagem
        if (typeof Tela == "string")
            (<ComModal>_TelaModal.instance).sknMessage = Tela;
        else
            (<ComModal>_TelaModal.instance).sknTemplate = Tela;
        //Passando os parametros para a tela pai
        (<ComModal>_TelaModal.instance).sknParam = Parameter;
        (<ComModal>_TelaModal.instance).Dialog = this;
        //Evento de on close
        (<ComModal>_TelaModal.instance).sknOnClose = Options ? Options.sknOnClose : null;
        (<ComModal>_TelaModal.instance).sknOptions = Options;
        (<ComModal>_TelaModal.instance).sknNgModuloFactory = Options ? Options.FactoryInstance : null;
        //Recuperando o Id da tela modal gerado
        const _IndiceModal = (<ComModal>_TelaModal.instance).Id;
        this.TelasModais[_IndiceModal] = _TelaModal;
        //Acidiona a tela modal atual
        this.TelaModalAtual = _TelaModal;
        //Retorna o indice da tela Modal
        return (<ComModal>_TelaModal.instance).Id;
    }


    /**
     * Fecha a tela modal e destroy o objeto
     * @param Indice
     * @constructor
     */
    public CloseModal(Indice?: string, Params?: any) {
        let _Modal: ComponentRef<ComModal>;
        if (Indice && this.TelasModais[Indice])
            _Modal = this.TelasModais[Indice];
        //Se não passou o ID, Fechamos a ultima janela
        else
            _Modal = this.TelaModalAtual;
        if (_Modal == null)
            throw new Error("Tela modal não encontrado na pila.");
        //Adicionando os parametros de close
        (<ComModal>_Modal.instance).sknCloseParam = Params;
        (<ComModal>_Modal.instance).FecharTela();
    }

    /**
     * Utilizado para destruir a Tela: Não deve ser utilizado como método padrao de fechamento
     * @param Indice
     * @constructor
     */
    public CloseModalCorporativo(Indice?: string) {
        let _Modal: ComponentRef<ComModal>;
        if (Indice && this.TelasModais[Indice])
            _Modal = this.TelasModais[Indice];
        //Se não passou o ID, Fechamos a ultima janela
        else
            _Modal = this.TelaModalAtual;
        if (_Modal == null)
            throw new Error("Tela modal não encontrado na pila. ");
        //Recuperando os parametros de on close
        let _SknOnClose = (<ComModal>_Modal.instance).sknOnClose;
        let _OnCloseParam = <ComModal>_Modal.instance.sknCloseParam;
        /*//Recuperando os parametros de on close
        if ((<ComModal>_Modal.instance).sknOnClose)
            (<ComModal>_Modal.instance).sknOnClose(<ComModal>_Modal.instance.sknCloseParam);*/
        //Destruindo o objeto
        _Modal.destroy();
        //Se a tela modal atual for igual, então setamos a referencia para nulo para não gerar memory leak
        if (_Modal == this.TelaModalAtual)
            this.TelaModalAtual = null;
        //Se tiver parametro de on close
        if (_SknOnClose) {
            //Usa o timeout para não dar conflito de permissão de telas nas requisições http
            setTimeout(() => {
                try {
                    _SknOnClose(_OnCloseParam);
                    _SknOnClose = null;
                    _OnCloseParam = null;
                }
                catch (E) {
                    this.Log.LogError(E);
                }
            });
        }

    }

    /**
     * Mostra uma mensagem de ok e cancel
     */
    public ShowOkCancel(Message: string, Title?: string, Callback?: () => void, Icone?: string) {
        this.AppParameter.EnableKeyEvent = false;
        swal({
            title: this.Util.GetTranslation(Title ? Title : 'FACDIALOG_AVISO'),
            text: this.Util.GetTranslation(Message),
            type: Icone ? Icone : 'info',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'OK (Enter)',
            cancelButtonText: 'Cancelar (Esc)'
        }, (IsConfirm) => {
            //Timeout para debounce
            setTimeout(() => {
                this.AppParameter.EnableKeyEvent = true;
                //console.log("Setou para " + this.AppParameter.EnableKeyEvent);
            }, 400);
            if (IsConfirm && Callback)
                Callback();
        });
    }

    public GenerateError(Error: any) {
        //Loga o erro
        this.Log.LogError(Error);
        this.ShowErrorMessage('A00FR01_GENERIC_ERROR');
    }
}
