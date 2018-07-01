/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A02AP02 - Cloud commerce PDV                                ::
 ::  Tipo        : Implementaçao                                               ::
 ::  Descrição   : Implementação NoSQL para consulta relacionadas ao caixa     ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


import {ICaixa} from "../Interface/ICaixa";
import {IUser} from "../../../A00FR01/NoSQL/Interfaces/IUser";
import {CfyDialog} from "../../../A00FR01/Services/CfyDialog";
import {CfyQueryService} from "../../../A00FR01/Services/CfyQueryService";
import {CfyUtilServices} from "../../../A00FR01/Services/CfyUtilServices";
import {Observable} from "rxjs/internal/Observable";
import {NoSQLFactory} from "../../../A00FR01/NoSQL/Impl/NoSQLFactory";

export class CaixaNoSQL extends ICaixa {

    constructor(private AppParameter,
                Dialog: CfyDialog,
                ExecRemote: CfyQueryService,
                Util: CfyUtilServices,
                private SQlFactory: NoSQLFactory,
                UserInterface: IUser) {
        super(ExecRemote, Dialog, Util, UserInterface);
    }

    private CriarCaixaCollection(Database) {
        Database.addCollection("CAIXA", {
            indices: ["CC003_NR_EMPRESA", "CC003_NR_FILIAL", "CC003_NR_CAIXA"]
        });
    }

    /**
     * Salvando o caixa na base de dados local
     * @param Caixa
     * @returns {Observable<any>|"../../Observable".Observable<any>|"../../../Observable".Observable<any>}
     * @constructor
     */
    SalvarCaixa(Caixa, SalvarOnline): Observable<any> {
        return new Observable<any>(Observer => {
            this.SQlFactory.getDatabase().then((Database) => {
                try {
                    const _Caixas = Database.getCollection("CAIXA");
                    //Se não existir o caixa, cria a tabela e resolve a promesa sem o caixa
                    if (!_Caixas)
                       this.CriarCaixaCollection(Database);
                    //Verificando se o caixa já existe. Se existir, apenas atualizamos o mesmo
                    const _Caixa = _Caixas.findOne({
                        '$and': [{'CC003_NR_EMPRESA': Caixa.CC003_NR_EMPRESA}
                            , {'CC003_NR_FILIAL': Caixa.CC003_NR_FILIAL}, {"CC003_NR_CAIXA": Caixa.CC003_NR_CAIXA}]
                    });
                    Caixa.LokiUltimaAtualizacao = new Date();
                    //Se já existir, apenas atualizamos o objeto
                    if (_Caixa) {
                        //Atualizando o objeto
                        _Caixas.update(Caixa, {"$loki" : _Caixa.$loki});
                    }
                    //Senão inserimos
                    else {
                        _Caixas.insert(Caixa);
                    }

                    if (SalvarOnline) {
                        this.AtualizarCaixaOnline(Caixa).subscribe(() => {
                            Observer.next();
                            Observer.complete();
                        });
                    }
                    else {
                        Observer.next();
                        Observer.complete();
                    }

                }
                catch (E) {
                    this.Dialog.GenerateError(E);
                    Observer.complete();
                }
            }).catch(Error => {
                this.Dialog.GenerateError(Error);
                Observer.complete();
            });
        });
    }

    getUltimoCaixaLogado() {
        return new Promise<any>((Resolve, Reject) => {
            this.SQlFactory.getDatabase().then((Database) => {
                try {
                    const _Caixas = Database.getCollection("CAIXA");
                    //Se não existir o caixa, cria a tabela e resolve a promesa sem o caixa
                    if (!_Caixas) {
                        this.CriarCaixaCollection(Database);
                        Resolve();
                    }
                    else {
                        //Se a tabela existir, tentamos então recuperar o objeto do caixa atrelado
                        const _Caixa = _Caixas.chain().find().simplesort("LokiUltimaAtualizacao").limit(1).data();
                        if (_Caixa && _Caixa.length)
                            Resolve(_Caixa[0]);
                        else
                            Resolve();
                    }
                }
                catch (E) {
                    this.Dialog.GenerateError(E);
                    Reject(E);
                }
            }).catch(Error => {
                this.Dialog.GenerateError(Error);
                Reject(Error);
            });
        });
    }

    /**
     * Recupera o caixa atual registrado
     * @returns {Promise<any>}
     */
    getCaixaAtual() {
        return new Promise<any>((Resolve, Reject) => {
            this.SQlFactory.getDatabase().then((Database) => {
                try {
                    const _Caixas = Database.getCollection("CAIXA");
                    //Se não existir o caixa, cria a tabela e resolve a promesa sem o caixa
                    if (!_Caixas) {
                        this.CriarCaixaCollection(Database);
                        Resolve();
                    }
                    else {
                        //Se a tabela existir, tentamos então recuperar o objeto do caixa atrelado
                        const _Caixa = _Caixas.findOne({
                            "$and": [
                                {'CC003_NR_EMPRESA': {"$aeq": this.AppParameter.UsuarioLogado.EmpresaNumero}}
                                , {'CC003_NR_FILIAL': {"$aeq": this.AppParameter.UsuarioLogado.FilialNumero}}]
                        });
                        if (_Caixa)
                            Resolve(_Caixa);
                        else
                            Resolve();
                    }
                }
                catch (E) {
                    this.Dialog.GenerateError(E);
                    Reject(E);
                }
            }).catch(Error => {
                this.Dialog.GenerateError(Error);
                Reject(Error);
            });
        });
    }


}