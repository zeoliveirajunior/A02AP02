/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Tipo        : Variaveis                                                   ::
 ::  Descrição   : Variaveis de ambiente de produção                           ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Enviroment} from "../A00FR01/Interfaces/Enviroment";

export const environment: Enviroment = {
    production: true,
    Url: "http://localhost:8080/H02AP01/",
    SystemName: "Cloud commerce PDV",
    SystemPackage: "E02AP01",
    TpApp: 2,
    TpTecnologia : 1,
    DBVersion: '1.0',
    TransacaoFixa : 'H02SF0105A'
};
