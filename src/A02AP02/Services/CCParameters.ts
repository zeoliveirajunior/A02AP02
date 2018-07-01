/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A02AP02 - Cloud commerce PDV                                ::
 ::  Tipo        : Serviço                                                     ::
 ::  Descrição   : Singleton com os parametros do PDV                          ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CCParameters {

    Caixa: any;

}
