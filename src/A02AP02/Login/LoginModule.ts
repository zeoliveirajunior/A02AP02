import {NgModule} from "@angular/core";
import {LoginPage} from "./LoginPage/LoginPage";
import {CaixaPage} from "./Caixas/CaixaPage";
import {A00FR01} from "../../A00FR01/A00FR01.module";
import {RouterModule} from "@angular/router";
import {LoginRoutes} from "./LoginRouter";


@NgModule({
    declarations: [
        LoginPage,
        CaixaPage
    ],
    imports: [
        RouterModule.forChild(LoginRoutes),
        A00FR01
    ],
    exports: [
        CaixaPage
    ],
    entryComponents: [
        LoginPage,
        CaixaPage,
    ]
})
export class LoginModule {}

