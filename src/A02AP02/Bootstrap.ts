/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E02AP01 - Cloud commerce PDV                                ::
 ::  Arquivo     : Bootstrap.ts                                                ::
 ::  Tipo        : Bootstrap                                                   ::
 ::  Descrição   : Configuração inicial da aplicação                           ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Component} from "@angular/core";
import {ALocale} from "../A00FR01/Locale/ALocale";
import {AppParameters} from "../A00FR01/Services/AppParameters";
import {environment} from "../environments/environment";

@Component({
    selector: "app-root",
    template: '<login-page></login-page>'
})
export class App {

    /* INICIALIZAÇÕES */
    constructor(LocaleService: ALocale,
                AppParameter: AppParameters) {
        /**
         * Inicialização do idioma
         */
        LocaleService.setLanguage();
        LocaleService.Load();
        AppParameter.Ambiente = environment
        /*/!**
         * Configuração da Aplicação
         *!/
        /!**
         * Configurações da aplicação
         *!/
        Config.setSystemCode("02");
        Config.setSystemName("Cloud commerce - PDV");
        Config.setSystemPrefix("CC");
        Config.setSystemVersion("1.0");
        Config.VersaoDB = "1.0";
        Config.setSystemModule("E02AP01");
        AppParameter.Database = LocalDataBaseCC;
        //Parametros do firebase
        AppParameter.FireBaseConfFile = FireBaseApiKey;*/

    }
}

