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

import {Injectable} from "@angular/core";
import {A00FR01} from "../A00FR01.module";
import {AppParameters} from "./AppParameters";
import {TranslateService} from "@ngx-translate/core";
import {CLog} from "../Handler/CLog";
import {CfyUtilServices} from "./CfyUtilServices";


/**
 * Variaveis de plugin JQuery
 */
declare var $: any;

declare var mApp: any;

declare var toastr: any;

declare var swal: any;

@Injectable({
    providedIn: A00FR01
})
export class CfyDialog {

    constructor(private AppParameter: AppParameters,
                private Translate: TranslateService,
                private Util: CfyUtilServices,
                private Log: CLog) {

    }

    ShowWaitWindow(Mensagem: string) {
        if (!Mensagem)
            Mensagem = 'FACDIALOG_SHOW_WAIT_DEFAULT_MESSAGE';
        Mensagem = this.Translate.instant(Mensagem);
        //this.AppParameter.EnableKeyEvent = false;
        let _Configuracao = {
            message: `                                   
                  <h3 style="color:#fff">${Mensagem}</h3>
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
            css: {border: '0px', color: '#fff', backgroundColor: "transparent", "z-index": 60000},
            overlayCSS: {
                "z-index": 60000,
            },
        };
        //$.blockUI(_Configuracao);
        mApp.blockPage({
            overlayColor: "#000000",
            type: "loader",
            state: "success",
            message: Mensagem
        });
        this.Log.Log(Mensagem, 4);

    }

    HideWaitWindow() {
        mApp.unblockPage()
        //$.unblockUI();

        /*setTimeout(() => {
         this.AppParameter.EnableKeyEvent = true;
         });*/
    }

    /**
     * Mostra uma mensagem de erro para o usuario
     * @param Mensagem
     * @param Titulo
     * @constructor
     */
    public ShowErrorMessage(Mensagem: string, Titulo?: string) {
        this.ShowConfirmation(Mensagem, Titulo, "error");
    }

    public ShowErrorNotification(Notification: string, Titulo?: string) {
        this.ShowNotification(Notification, Titulo, "danger");
    }

    public ShowWarningNotification(Notification: string, Titulo?: string) {
        this.ShowNotification(Notification, Titulo, "warning");
    }

    // Exibe uma notificação na tela
    public ShowNotification(Notification: string, Titulo?: string, Tipo?: string, Position?: string) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": Position || "toast-top-center",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        toastr[Tipo ? Tipo : "success"](this.Util.GetTranslation(Notification), Titulo);
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
            //this.AppParameter.EnableKeyEvent = false;
            swal({
                title: this.Util.GetTranslation(Message),
                text: this.Util.GetTranslation(Title || this.AppParameter.Ambiente.SystemName),
                type: Icone ? Icone : "success",
                showConfirmButton: true,
                onClose: () => {
                    setTimeout(() => {
                        //Timeout para debounce
                        //this.AppParameter.EnableKeyEvent = true;
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
     * Mostra uma mensagem de ok e cancel
     */
    public ShowOkCancel(Message: string, Title?: string, Callback?: () => void, Icone?: string) {
        //this.AppParameter.EnableKeyEvent = false;
        swal({
            title: this.Util.GetTranslation(Title ? Title : "FACDIALOG_AVISO"),
            text: this.Util.GetTranslation(Message),
            type: Icone ? Icone : "info",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "OK (Enter)",
            cancelButtonText: "Cancelar (Esc)"
        }, (IsConfirm) => {
            //Timeout para debounce
            setTimeout(() => {
                //this.AppParameter.EnableKeyEvent = true;
                //console.log("Setou para " + this.AppParameter.EnableKeyEvent);
            }, 400);
            if (IsConfirm && Callback)
                Callback();
        });
    }

    public GenerateError(Error: any) {
        //Loga o erro
        this.Log.LogError(Error);
        this.ShowErrorMessage("E00FR01_GENERIC_ERROR");
    }
}
