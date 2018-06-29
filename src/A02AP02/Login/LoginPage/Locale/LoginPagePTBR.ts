/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A02AP02 - PDV                                               ::
 ::  Tipo        : Locale                                                      ::
 ::  Descrição   : Locale PTBR com as traduções                                ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


import {ILocale} from "../../../../A00FR01/Locale/ALocale";


export class LoginPagePTBR implements ILocale {

    AddLanguage() {
        return {
            "LOGIN_PAGE_TITLE" : "Cloud commerce PDV",
            "LOGIN_PAGE_TITLE_INFO" : "O software que leva seu negócio as alturas",
            "LOGIN_PAGE_COPYRIGHT" : "Copyright Cloudfy 2018",
            "LOGIN_PAGE_CONTATO" : "Contato",
            "LOGIN_PAGE_NAO_POSSUI" : "Não tem uma conta?",
            "LOGIN_PAGE_ADIQUIRIR" : "Quero Adquirir",
            "LOGIN_PAGE_INFO_LOGIN_SENHA" : "Entre com suas informações de login e senha",
            "LOGIN_PAGE_INFO_USUARIO" : "Usuario",
            "LOGIN_PAGE_INFO_SENHA" : "Senha",
            "LOGIN_PAGE_BTN_ENTRAR" : "Entrar",
            "LOGIN_PAGE_INFO_OU" : "OU",
            "LOGIN_PAGE_ESQUECEU_SENHA" : "Esqueceu sua senha ?",

            /*Mensagens de retorno do login */
            "LOGIN_PAGE_AUTENTICADO_SUCESSO" : "Usuario autenticado com sucesso"
        }
    }

}
