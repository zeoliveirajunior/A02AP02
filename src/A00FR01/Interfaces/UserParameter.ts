/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Tipo        : Interface                                                   ::
 ::  Descrição   : Parametros do usuario logado na aplicação                   ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export class UserParameter {
    //Informações do usuario
    AccessNumber:number;
    UserNr:number;
    UserLogin:string;
    UserPsw:string;
    UserEmail:string;
    UserName:string;
    EmpresaNumero:string;
    EmpresaNome:string;
    EmpresaCNPJ:string;
    EmpresaEndereco:string;
    FilialNumero:number;
    FilialNome:string;
    //Se possui multiplas filiais, então nao exibimos o botão de troca de filial
    MultiplasFiliais:boolean;
    TransactionList: Array<string>;
}

