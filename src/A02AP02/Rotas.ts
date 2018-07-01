/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A02AP02 - Cloud commerce PDV                                ::
 ::  Tipo        : Rotas                                                       ::
 ::  Descrição   : Arquivo principal de rotas                                  ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
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
