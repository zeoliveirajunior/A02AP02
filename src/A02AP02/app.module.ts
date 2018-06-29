import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, LOCALE_ID, NgModule} from "@angular/core";
import {registerLocaleData} from "@angular/common"
import localePt from "@angular/common/locales/pt"
import {A00FR01} from "../A00FR01/A00FR01.module";
import {LoginPage} from "./Login/LoginPage/LoginPage";
import {App} from "./Bootstrap";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ALocale} from "../A00FR01/Locale/ALocale";
import {LocaleLoader} from "./LocaleLoader";
import {CfyErrorHandler} from "../A00FR01/Handler/CfyErrorHandler";

registerLocaleData(localePt, 'pt');

@NgModule({
    declarations: [
        LoginPage,
        App
    ],
    imports: [
        BrowserModule,
        A00FR01,
        TranslateModule.forRoot(),
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
        }

    ],
    bootstrap: [App]
})
export class AppModule {
}
