/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Tipo        : Serviço                                                     ::
 ::  Descrição   : Serviço para passar parametros para um modal                ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Injectable} from "@angular/core";

@Injectable()
export class CfyParams {

  private Params;

  constructor() {}

  public get() {
    const _Param = this.Params;
    //Zerando a referencia para impedir memory leak
    this.Params = null;
    return _Param;
  }

  public set(Param) {
    this.Params = Param;
  }


}
