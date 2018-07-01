/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E00FR01 - Angular 2 corporativo                             ::
 ::  Arquivo     : ISincronizacao.ts                                           ::
 ::  Tipo        : Service                                                     ::
 ::  Descrição   : Interface para o serviço de sincronização                   ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export interface ISincronizacao {

    /**
     * Verifica se é a primeira sincronização
     * @constructor
     */
    VerificaPrimeiraSincronizacao(): Promise<boolean>;

    SalvaSincronizacao(): Promise<any>;

    VerificaItensParaSincronizar(Tabelas): Promise<Array<any>>;

    SincronizaTabela(Tabela: any, Registros): Promise<any>;


}