/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Tipo        : Handler                                                     ::
 ::  Descrição   : Handler de erros para gerar logs do angular                 ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {forwardRef, Injectable} from "@angular/core";
import {A00FR01} from "../A00FR01.module";
import {DatePipe, JsonPipe} from "@angular/common";
import {AppParameters} from "../Services/AppParameters";

@Injectable({
    providedIn: A00FR01
})
export class CLog {

    constructor(private AppParameter: AppParameters, private DatePipe: DatePipe, private Json: JsonPipe) {

    }

    Log(Message: String | any, LogLevel:number = 1, Error:boolean = false) {
        if (this.AppParameter.LogLevel >= LogLevel) {
            if (typeof Message === "string") {
                let _Message = this.DatePipe.transform(new Date(), 'dd/M/yyyy hh:mm:ss') + ' - ' + Message;
                this.GravarArquivoLog(_Message, Error);
            }
            else {
                if (Error)
                    console.error(Message);
                else
                    console.log(Message);
            }
        }
    }

    LogError(Message: String | any) {
        this.Log(Message, 1, true);
    }

    private GravarArquivoLog(Message: string, Error:boolean) {
        if (Error)
            console.error(Message);
        else
            console.log(Message);
    }


}
