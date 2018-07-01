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

import {Injectable} from "@angular/core";
import {DatePipe, JsonPipe} from "@angular/common";
import {AppParameters} from "../Services/AppParameters";

@Injectable()
export class CLog {

    constructor(private AppParameter: AppParameters, private DateFunc: DatePipe, private Json: JsonPipe) {
    }

    Log(Message: String | any, LogLevel: number = 1, Error: boolean = false) {
        if (this.AppParameter.LogLevel >= LogLevel) {
            if (typeof Message === "string") {
                const _Message = this.DateFunc.transform(new Date(), 'dd/M/yyyy hh:mm:ss') + ' - ' + Message;
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

    private GravarArquivoLog(Message: string, Error: boolean) {
        if (Error)
            console.error(Message);
        else
            console.log(Message);
    }


}
