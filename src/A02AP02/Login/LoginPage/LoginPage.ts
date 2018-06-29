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

import {Component, OnInit, ViewChild} from "@angular/core";
import {CfyLoginService} from "../../../A00FR01/Services/CfyLoginService";
import {CfyDialog} from "../../../A00FR01/Services/CfyDialog";


@Component({
    selector: "login-page",
    templateUrl: "./LoginPage.html",
    styleUrls: ["./LoginPage.css"]
})
export class LoginPage implements OnInit {

    @ViewChild("Form")
    Form;

    ngOnInit(): void {
        
    }

    constructor(private LoginService: CfyLoginService, private Dialog: CfyDialog) {

    }

    Login() {
        this.LoginService.DoLogin(this.Form.value.UserName, this.Form.value.Password, null, null, false, true).subscribe((User) => {
            this.Dialog.ShowNotification("LOGIN_PAGE_AUTENTICADO_SUCESSO");
        });
    }


}
