/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  ::  Empresa     : Cloudfy                                                     ::
  ::  Systema     : A00FR01 - Angular framework                                 ::
  ::  Tipo        : Model                                                       ::
  ::  Descrição   : Entidade utilizada para opções de modais                    ::
  ::----------------------------------------------------------------------------::
  ::  Programador : José Carlos de Oliveira Junior                              ::
  ::  Data        : 29/06/2017                                                  ::
  ::  Alteração   : Primeira versão                                             ::
  ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


export class MModalOptions {
  /*Titulo da tela modal - Default - Nome da aplicação*/
  Titulo: string;
  /* Exibe o botão fechar default da tela. Default: true*/
  ShowCloseButton: boolean = true;
  /*  Permite multiplas modais: Default: true */
  MultipleModal: boolean = true;
  sknOnClose: (Parametros?) => void;
  /**
   *      Array com os botoes {
     *        Texto: Texto do botão
     *        OnClick: Função chamada no evento do click
     *        Class: Array com as classes CSS
     */
  Botoes: Array<any>;
  /* Permite fechar a tela com ESC e clicando fora. Default: */
  Fechar: boolean = true;
  /* Evento de KeyPress*/
  OnKeyPress: any;
  /* Instancia padrao para o factory*/
  FactoryInstance;
}
