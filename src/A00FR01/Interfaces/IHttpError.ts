/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Tipo        : Interface                                                   ::
 ::  Descrição   : Interface de de Erros de Http                               ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export interface IHttpError {

  Status: number;

  Mensagem: string;

  Stacktrace: string;

  ObjetoErro: any;
}