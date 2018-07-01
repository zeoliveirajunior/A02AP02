import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, LOCALE_ID, NgModule} from "@angular/core";
import {registerLocaleData} from "@angular/common";
import localePt from "@angular/common/locales/pt";
import {A00FR01} from "../A00FR01/A00FR01.module";
import {App} from "./Bootstrap";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ALocale} from "../A00FR01/Locale/ALocale";
import {LocaleLoader} from "./LocaleLoader";
import {CfyErrorHandler} from "../A00FR01/Handler/CfyErrorHandler";
import {CfyUtilServices} from "../A00FR01/Services/CfyUtilServices";
import {AppParameters} from "../A00FR01/Services/AppParameters";
import {NoSQLFactory} from "../A00FR01/NoSQL/Impl/NoSQLFactory";
import {ICaixa} from "./SQL/Interface/ICaixa";
import {CaixaNoSQL} from "./SQL/LokiImpl/CaixaNoSQL";
import {CfyDialog} from "../A00FR01/Services/CfyDialog";
import {CfyQueryService} from "../A00FR01/Services/CfyQueryService";
import {RouterModule} from "@angular/router";
import {APP_ROUTES} from "./Rotas";

registerLocaleData(localePt, 'pt');

@NgModule({
    entryComponents: [],
    declarations: [
        App
    ],
    imports: [
        TranslateModule.forRoot(),
        BrowserModule,
        RouterModule.forRoot(APP_ROUTES, {useHash: true}),
        A00FR01.forRoot(),
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: CfyErrorHandler
        },
        {
            provide: LOCALE_ID,
            useValue: "pt"
        },
        {
            provide: ALocale,
            useClass: LocaleLoader,
            deps: [TranslateService]
        },
        {
            provide: ICaixa,
            useClass: CaixaNoSQL,
            deps: [AppParameters, CfyDialog, CfyQueryService, CfyUtilServices, NoSQLFactory, "IUser"]
        },

    ],
    bootstrap: [App]
})
export class AppModule {
}
