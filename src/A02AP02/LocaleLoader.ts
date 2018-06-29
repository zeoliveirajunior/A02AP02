/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A02AP02 - Cloud commerce PDV                                ::
 ::  Arquivo     : LocaleLoader.ts                                             ::
 ::  Tipo        : Locale                                                      ::
 ::  Descrição   : Carga dos locales da aplicação                              ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 28/06/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {TranslateService} from "@ngx-translate/core";
import {Injectable} from "@angular/core";
import {ALocale} from "../A00FR01/Locale/ALocale";
import {LoginPagePTBR} from "./Login/LoginPage/Locale/LoginPagePTBR";

@Injectable({
   providedIn: 'root'
})
export class LocaleLoader extends ALocale {

    constructor(public Translate: TranslateService) {
        super(Translate);
    }

    PTBR() {
        //LoginPage
        this.setTranslate(new LoginPagePTBR().AddLanguage());
    }


}