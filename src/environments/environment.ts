/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Tipo        : Variaveis                                                   ::
 ::  Descrição   : Variaveis de ambiente de desenvolvimento                    ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Enviroment} from "../A00FR01/Interfaces/Enviroment";

export const environment:Enviroment = {
  production: false,
  Url: "/",
  SystemName: "Cloud commerce PDV",
  SystemPackage: "A02AP02",
  DBVersion: "1.0",
  TpApp: 2
};
