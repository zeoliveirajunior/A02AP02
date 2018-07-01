/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  ::  Empresa     : Cloudfy                                                     ::
  ::  Systema     : M00FR01 - Mobile Ionic 2                                    ::
  ::  Tipo        : Model                                                       ::
  ::  Descrição   : Entidade utilizada para consulta na base de dados           ::
  ::----------------------------------------------------------------------------::
  ::  Programador : José Carlos de Oliveira Junior                              ::
  ::  Data        : 04/01/2017                                                  ::
  ::  Alteração   : Primeira versão                                             ::
  ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


export class MQueryParameters {
    // Nome da query ou query local
    public Query: string;
    // Parametros da url
    public Parameters: any;
    // Mensagem para travar a tela
    public Message: string;
    // Se irá mostrar a tela de aguarde
    public ShowWaitWindow: boolean = true;
    // Se irá mostrar uma mensagem de erro
    public ShowErrorMessage: boolean = true;

    /**
     * Exec method
     */
    NomeExecucaoRemota: string;

}
