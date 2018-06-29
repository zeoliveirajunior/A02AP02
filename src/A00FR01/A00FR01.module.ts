import {NgModule} from "@angular/core";
import {CommonModule, DatePipe, JsonPipe} from "@angular/common";
import {ComTextFieldComponent} from "./Components/com-text-field/com-text-field.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {CfyHttpService} from "./Services/CfyHttpService";
import {CfyLoginService} from "./Services/CfyLoginService";


@NgModule({
    declarations: [
        ComTextFieldComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        HttpClientModule
    ],
    exports : [
        ComTextFieldComponent,
        /* modulos */
        FormsModule,
        HttpClientModule
    ],
    providers: [
        DatePipe,
        JsonPipe
    ],
})
export class A00FR01 {
}
