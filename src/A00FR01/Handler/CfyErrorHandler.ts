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

import {ErrorHandler, Injectable} from "@angular/core";
import {A00FR01} from "../A00FR01.module";
import {HttpErrorResponse} from "@angular/common/http";
import {CLog} from "./CLog";

@Injectable({
    providedIn: A00FR01
})
export class CfyErrorHandler extends ErrorHandler {

    constructor(private Log: CLog) {
        super();
    }

    handleError(Error: HttpErrorResponse | any) {
        super.handleError(Error);
        this.Log.Log(Error, 1, true);
    }


}
