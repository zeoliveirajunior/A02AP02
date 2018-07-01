import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule, DatePipe, JsonPipe} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {ComModal} from './Components/ComModal/ComModal';
import {TranslateModule} from "@ngx-translate/core";
import {CfyPadroes} from "./Pages/Padroes/Padroes";
import {ComComboBox} from "./Components/ComComboBox/ComComboBox";
import {ComLine} from "./Components/ComLine/ComLine";
import {SknSize} from "./Components/Directive/SknSize";
import {ComButton} from "./Components/Directive/ComButton";
import {UserNSQL} from "./NoSQL/Impl/UserNSQL";
import {NoSQLFactory} from "./NoSQL/Impl/NoSQLFactory";
import {AppParameters} from "./Services/AppParameters";
import {CLog} from "./Handler/CLog";
import {SincronizacaoNSQL} from "./NoSQL/Impl/SincronizacaoNSQL";
import {CfyUtilServices} from "./Services/CfyUtilServices";
import {SincronizacaoPage} from "./Pages/SincronizacaoPage/SincronizacaoPage";
import {CfySincronizacao} from "./Services/CfySincronizacao";
import {CfyDialog} from "./Services/CfyDialog";
import {CfyHttpService} from "./Services/CfyHttpService";
import {CfyLoginService} from "./Services/CfyLoginService";
import {CfyParams} from "./Services/CfyParams";
import {CfyQueryService} from "./Services/CfyQueryService";
import {CfyValidationService} from "./Services/CfyValidationService";


@NgModule({
    entryComponents: [
        ComModal,
        CfyPadroes,
        ComComboBox,
        ComLine,
        SincronizacaoPage,
    ],
    declarations: [
        ComModal,
        CfyPadroes,
        ComComboBox,
        ComLine,
        SknSize,
        ComButton,
        SincronizacaoPage
    ],
    imports: [
        TranslateModule,
        FormsModule,
        CommonModule,
        HttpClientModule
    ],
    exports: [
        ComModal,
        CfyPadroes,
        ComLine,
        ComComboBox,
        SknSize,
        ComButton,
        SincronizacaoPage,
        /* modulos */
        TranslateModule,
        CommonModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        DatePipe,
        JsonPipe
    ],
})
export class A00FR01 {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: A00FR01,
            providers: [
                AppParameters,
                CfyDialog,
                CLog,
                CfyUtilServices,
                CfySincronizacao,
                NoSQLFactory,
                CfyHttpService,
                CfyLoginService,
                CfyParams,
                CfyQueryService,
                CfyValidationService,
                /* Serviços de acesso a banco de dados */
                {provide: "IUser", useClass: UserNSQL, deps: [NoSQLFactory, AppParameters, CLog, CfyUtilServices]},
                {provide: "ISincronizacao", useClass: SincronizacaoNSQL, deps: [NoSQLFactory, AppParameters, CLog, CfyUtilServices]}
            ]
        };
    }
}
