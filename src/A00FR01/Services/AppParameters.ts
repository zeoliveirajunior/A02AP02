/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Tipo        : Serviço                                                     ::
 ::  Descrição   : Singleton de parametros da aplicação                        ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Injectable} from "@angular/core";
import {Enviroment} from "../Interfaces/Enviroment";
import {UserParameter} from "../Interfaces/UserParameter";

@Injectable({
  providedIn: 'root'
})
export class AppParameters {

  /**
   * Variaveis de ambiente utilizadas na inicialização
   */
  Ambiente:Enviroment;

  /**
   * Token de autenticação
   */
  AutToken:string;

  /**
   * Nivel do log para o componente de logs
   * Quanto maior o nivel do log, mais analitico
   * @type {number}
   */
  LogLevel: number = 4;

  AfterLogin: (User: UserParameter) => {};

  UsuarioLogado: UserParameter;

  Switches: any;

  isLogged() {
    return this.AutToken != null;
  }

  constructor() {

  }
}
