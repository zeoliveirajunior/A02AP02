/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A02AP02 - Cloud commerce PDV                                ::
 ::  Tipo        : Constante                                                   ::
 ::  Descrição   : Configuração da base NOSQL local                            ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


export const LocalDataBaseCC = {
    "Database": "CloudCommerce",
    "Versao": "2.2",
    "Documentos": {
        "MICROTERMINAL": ["CC019_NR_EMPRESA", "CC019_IT_MTERM"],
        "URLWEBSERVICE": ["CC013_VC_CODUF", "CC013_IT_TPAMB", "CC013_IT_SERV"],
        "SAT": ["CC014_NR_SAT"],
        "COMANDA": ["CC005_NR_EMPRESA", "CC005_NR_FILIAL", "CC005_NR_COMANDA"],
        "CAIXA": ["C003_NR_EMPRESA", "C003_NR_FILIAL", "C003_NR_CAIXA"],
        "MOVIMENTO": ["CC077_NR_EMPRESA", "CC077_NR_FILIAL", "CC077_NR_CAIXA", "CC077_DT_MOVTO", "CC077_NR_MOVTO"],
        "TEF": ["CC061_NR_EMPRESA", "CC061_NR_TEF", "CC061_IT_TPTEF"],
        "CONTAS": ["FI020_NR_EMPRESA", "FI020_NR_CONTA"],
        "NFECONF": ["CC012_NR_EMPRESA", "CC012_NR_FILIAL", "CC012_NR_CAIXA"],
        "RECVENDAPRAZO": ["CC076_NR_EMPRESA", "CC076_NR_CLIENTE", "CC076_NR_PAGTO"],
        "PAR_CLI": ["CC006_NR_EMPRESA", "CC006_NR_PESSOA"],
        "VENDAxPGTO": ["CC074_NR_EMPRESA", "CC074_NR_FILIAL", "CC074_NR_CAIXA", "CC074_NR_CUPOM", "CC074_NR_PAGTO"],
        "ILHAS": ["CC030_NR_EMPRESA", "CC030_NR_FILIAL", "CC030_NR_ILHA"],
        "CLIENTES": ["AD020_NR_EMPRESA", "AD020_NR_PESSOA", "AD020_VC_CPFCNPJ", "AD020_VC_PESSOA"],
        "CONFEMISS": ["CC016_NR_EMPRESA", "CC016_NR_FILIAL", "CC016_NR_CAIXA"],
        "ATENDENTE": ["CC018_NR_EMPRESA", "CC018_NR_USR"],
        "PRODUTOS": ["CC040_NR_EMPRESA", "CC040_NR_PROD", "CC040_VC_PROD"],
        "REDE": ["CC066_NR_ADQUI", "CC066_IT_BAND", "CC066_IT_TPPRD"],
        "SANGRIA": ["CC079_NR_EMPRESA", "CC079_NR_FILIAL", "CC079_NR_CAIXA", "CC079_DT_MOVTO", "CC079_NR_MOVTO", "CC079_NR_SEQ"],
        "SYNC": ["CC080_NR_EMPRESA", "CC080_NR_FILIAL", "CC080_NR_CAIXA", "CC080_NR_SEQ"],
        "PAGAMENTOS": ["CC004_NR_EMPRESA", "CC004_NR_FILIAL", "CC004_IT_FPAGAME"],
        "CATFINANCEIRA": ["FI011_NR_EMPRESA", "FI011_NR_CAT"],
        "CONFSAT": ["CC015_NR_EMPRESA", "CC015_NR_FILIAL", "CC015_NR_CAIXA"],
        "VENDAxITENS": ["CC073_NR_EMPRESA", "CC073_NR_FILIAL", "CC073_NR_CAIXA", "CC073_NR_CUPOM", "CC073_NR_ITEM"],
        "BALANCA": ["CC023_NR_EMPRESA", "CC023_NR_FILIAL", "CC023_NR_CAIXA"],
        "EMPRESA": ["AD002_NR_EMPRESA", "AD002_NR_FILIAL"],
        "VENDA": ["CC072_NR_EMPRESA", "CC072_NR_FILIAL", "CC072_NR_CAIXA", "CC072_NR_CUPOM"],
        "CMDAxITENSxEXT": ["CC071_NR_EMPRESA", "CC071_NR_FILIAL", "CC071_NR_COMANDA", "CC071_DT_ESTORNO"],
        "CONF": ["CC022_NR_EMPRESA", "CC022_NR_FILIAL", "CC022_NR_CAIXA"],
        "SERVERCONF": ["CC017_NR_EMPRESA", "CC017_NR_FILIAL", "CC017_VC_HASH"],

    }

};