/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A02AP02 - Cloud commerce PDV                                ::
 ::  Tipo        : Rotas                                                       ::
 ::  Descri��o   : Arquivo principal de rotas                                  ::
 ::----------------------------------------------------------------------------::
 ::  Programador : Jos� Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Altera��o   : Primeira vers�o                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Routes} from "@angular/router";

/**
 * Constante que configura a rota
 * @type {[{path: string; component: LoginPage}]}
 */
export const APP_ROUTES: Routes = [
    {path: '', loadChildren: './Login/LoginModule#LoginModule'},
    /*{path: 'app', loadChildren: 'E02AP01/Pages/PagesModule#PagesModule'}*/
];
