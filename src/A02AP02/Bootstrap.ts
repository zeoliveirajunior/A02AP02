/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A02AP02 - Cloud commerce PDV                                ::
 ::  Tipo        : Bootstrap                                                   ::
 ::  Descrição   : Configuração inicial da aplicação                           ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {AfterViewInit, Component, Inject, ViewChild, ViewContainerRef} from "@angular/core";
import {ALocale} from "../A00FR01/Locale/ALocale";
import {AppParameters} from "../A00FR01/Services/AppParameters";
import {environment} from "../environments/environment";
import {LocalDataBaseCC} from "./SQL/LokiImpl/Database";
import {IUser} from "../A00FR01/NoSQL/Interfaces/IUser";
import {UserParameter} from "../A00FR01/Interfaces/UserParameter";
import {CLog} from "../A00FR01/Handler/CLog";

@Component({
    selector: "app-root",
    template: '<router-outlet #BootstrapCointainerRef></router-outlet>'
})
export class App implements AfterViewInit {


    @ViewChild("BootstrapCointainerRef", {read: ViewContainerRef})
    BootstrapCointainerRef: ViewContainerRef;

    /* INICIALIZAÇÕES */
    constructor(LocaleService: ALocale,
                @Inject("IUser")
                private UserDB: IUser,
                private Log: CLog,
                private AppParameter: AppParameters) {

        /**
         * Inicialização do idioma
         */
        LocaleService.setLanguage();
        LocaleService.Load();
        AppParameter.Ambiente = environment;
        AppParameter.Database = LocalDataBaseCC;
        AppParameter.AfterLogin = (Usuario: UserParameter) => {
            this.UserDB.SaveUser(Usuario).then((Salvo) => {
                this.Log.Log(`Salvo usuario ${Usuario.UserName} localmente`);
            });
        };
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

    ngAfterViewInit(): void {
        this.AppParameter.ContainerPrincipal = this.BootstrapCointainerRef;
    }
}

