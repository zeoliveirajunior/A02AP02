/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E00FR01 - Angular 2 corporativo                             ::
 ::  Arquivo     : IUser.ts                                                    ::
 ::  Tipo        : Service                                                     ::
 ::  Descrição   : Interface para o serviço de tratamento de usuario           ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


import {UserParameter} from "../../Interfaces/UserParameter";

export interface IUser {

    /**
     * Salva o usuario na base local
     * @param User
     * @constructor
     */
    SaveUser(User: UserParameter): Promise<any>;

    /**
     * Faz O login local
     * @param User
     * @param Password
     * @constructor
     */
    Login(User: string, Password: string): Promise<UserParameter>;

    /**
     * Deleta o usuario logado
     * 1 - Utilizado pela tela de caixas e pelo retorno na tela de login
     */
    DeletaUsuarioLogado(): Promise<any>;

    /**
     * Recuperando a empresa e a filial default se já existir
     */
    EmpresaFilialDefault(): Promise<any>;
}
