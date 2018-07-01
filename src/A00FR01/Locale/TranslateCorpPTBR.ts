/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Arquivo     : TranslateCorp.ts                                            ::
 ::  Tipo        : Locale                                                      ::
 ::  Descrição   : Locale PTBR com as traduções                                ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


import {ILocale} from "./ALocale";

export class TranslateCorpPTBR implements ILocale {

    AddLanguage() {
        return {
            /**
             * CfyLoginService
             */
            "CFYLOGINSERVICE_SHOW_WAIT_DEFAULT_MESSAGE": "Por favor aguarde...",
            "CFYLOGINSERVICE_ERROR_USUARIO_SEM_PERMISSAO": "Usuario sem permissão de acesso nesta empresa",
            "CFYLOGINSERVICE_ERROR_USUARIO_NAO_AUTENTICADO": "Usuario ou senha inválido(s)",
            "CFYLOGINSERVICE_ERROR_SERVIDOR_INDISPONIVEL": "Ocorreu um erro no acesso ao servidor. Por favor, verifique sua conexão com a internet.",

            /* CfyDialog */
            "CFYDIALOG_DEFAULT_TITLE_MESSAGE": "Cloudfy",
            "CFYDIALOG_GENERIC_ERROR": "Ocorreu um problema desconhecido. Por favor, verifique os Logs do sistema",
            "A00FR01_GENERIC_ERROR" : "Ops! Ocorreu um erro desconhecido. Por favor, entre em contato com o suporte",

            /*CfyQueryService*/
            "CFYQUERYSERVICE_ERROR_SEM_USUARIO_PREENCHIDO": "Sessão foi expirada. Por favor, realize o login novamente",
            /* COMModal */
            "COMMODAL_CLOSE": "Fechar",
            /* Padroes */
            "CFYPADROES_TITLE" : "Selecione a empresa e filial utilizada",
            "CFYPADROES_EMPRESA" : "Empresa",
            "CFYPADROES_FILIAL" : "Filial",
            "CFYPADROES_OK" : "Selecionar",
            "CFYPADROES_FECHAR" : "Voltar",
            "CFYPADROES_ERRO_SELECAO_EMPRESA_FILIAL" : "É preciso selecionar ao menos uma Empresa/Filial",
            /*Tela Sincronização*/
            "SINCRONIZACAOPAGE_TITLE": "Sincronização",
            "SINCRONIZACAOPAGE_ERROS_TOTAIS": "Ocorreram {{Erros}} erro(s) durante a sincronização.",
            "SINCRONIZACAOPAGE_TENTAR_NOVAMENTE": "Tentar novamente",
            "SINCRONIZACAOPAGE_SISTEMA_SINCRONIZADO": "Sistema sincronizado!",
            "SINCRONIZACAOPAGE_SISTEMA_SINCRONIZADO_EXPLICACAO": "Seu sistema já está com todos os dados sincronizado do servidor principal.",
            /* Resultset de SPS corporativas */
            "SPDEFAULT_DUPLICATED_KEY_ERROR": "O registro a ser inserido/alterado já existe na base de dados",
            "PAD01001_MAX_TRY_LOGIN": "Você excedeu o numero de tentativas para realizar o login. Clique em 'Esqueci minha' e siga as instruções para reiniciar a senha.",
            "PAD01001_INVALID_USER": "Usuario ou senha não conferem.",
            "PAD01001_BLOQUED_USER": "Usuario bloqueado. Motivo: {{Reason}}",
            "PAD01001_INACTIVE_USER": "Este usuario foi desativado.",
            "PAD01001_WITHOUT_PERFIL": "Usuario não possui perfil de acesso a este sistema.",
            "PAD01006_USER_TOKEN_NOT_FOUND": "Usuario não encontrado.",
            "PAD01006_USER_NOT_FOUND": "Não foi possível alterar a senha do usuário pois o mesmo não foi localizado no sistema.",
            "PAD01006_PASSWORD_ALREADY_USED": "Não foi possível alterar a senha do usuário pois a nova senha informada já foi utilizada anteriormente.",
            "PAD01007_NO_COMPANY": "Não foi possivel realizar a manutenção, pois a empresa informada não existe.",


            "PAD01011_NO_USER_AT_COMPANY": "Não foi possível realizar a manutenção, pois o usuário não está relacionado a empresa/filial informado.",
            "PAD01011_NO_PROFILE": "Perfil informada {{PROFILE}} não cadastrada/disponível no sistema para a empresa.",

            "PAD00008_PROFILE_ALREADY_IN_SYSTEM": "Não foi possível {{OPERATION}} pois o mesmo não está cadastrado no sistema.",
            "PAD00008_CONSIST_UPDATE": "atualizar dados do perfil ",
            "PAD00008_CONSIST_DELETE": "excluir perfil ",
            "PAD00008_COULD_NOT_INCLUDE_PROFILE": "Não foi possível incluir perfil pois o mesmo já está cadastrado no sistema.",
            "PAD00008_TRANSACTION_INVALID": "Transação informada {{TRANSACTION}} não cadastrada/disponível no sistema.",

            "PAD01004_NAO_FOI_POSSIVEL_ATUALIZAR_CLIENTE_NAO_INEXISTENTE": "Não foi possível atualizar dados do cliente de código {{ENT_NR_PESSOA}}, pois o mesmo não está cadastrado no sistema",
            "PAD01004_NAO_FOI_POSSIVEL_EXCLUIR_CLIENTE_NAO_INEXISTENTE": "Não foi possível excluir cliente de código {{ENT_NR_PESSOA}}, pois a mesmo não está cadastrado no sistema",
            "PAD01004_NAO_FOI_POSSIVEL_INCLUIR_CLIENTE": "Não foi possível incluir cliente de código {{ENT_NR_PESSOA}}, pois o mesmo já está cadastrado no sistema",
            "PAD01004_NOME_CLIENTE_DEVE_SER_INFORMADO": "Nome do cliente deve ser informado.",
            "PAD01004_CPFCNPJ_DEVE_SER_INFORMADO": "CPF/CNPJ da pessoa deve ser informado.",
            "PAD01004_CPFCNPJ_JA_CADASTRADO": "Não foi possível incluir pessoa, pois o CPF/CNPJ informado já está cadastrado.",
            "PAD01004_COD_PAIS_INVALIDO": "Código do país informado {{ENT_NR_PAIS}} não á válido.",
            "PAD01004_UF_INVALIDO": "Sigla do estado informado {{ENT_VC_UF}} não á válida.",
            "PAD01004_SITUAC_INVALIDO": "Identificador de situação {{ENT_IT_SITUAC}} não á válido. Valores esperados (1 - Ativo, 8 - Inativo)",
            "PAD01004_TP_PESSOA_INVALIDO": "Identificador de tipo de pessoa {{ENT_VC_TPPESS}} não á válido. Valores esperados (PF - Pessoa física, PJ - Pessoa jurídica).",
            "PAD01004_TP_CATEG_INVALIDO": "Identificador de categoria de pessoa {{ENT_VC_TPPESS}} não á válido. Valores esperados (01 - Cliente, 02 - Fornecedor, 03 - Ambos)",

            "PAD01014_WITHOUT_PERFIL": "Usuario não possui perfil para login nessa empresa."
        };

    }

}
