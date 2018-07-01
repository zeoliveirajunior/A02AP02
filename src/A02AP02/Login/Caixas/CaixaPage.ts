/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E02AP01 - Cloud commerce PDV                                ::
 ::  Arquivo     : CaixaPage.ts                                                ::
 ::  Tipo        : Page                                                        ::
 ::  Descrição   : Pagina de seleção de caixas                                 ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Component, Injector} from "@angular/core";
import {ITela} from "../../../A00FR01/Interfaces/ITela";
import {CfyParams} from "../../../A00FR01/Services/CfyParams";



/* declaração do jquery */
declare var $: any;

@Component({
    selector: "caixa-page",
    templateUrl: "CaixaPage.html",
    styleUrls: ["CaixaPage.css"]
})
export class CaixaPage extends ITela {

    ResultSet: Array<any>;
    RS: any = {};


    constructor(Injetor: Injector, Params: CfyParams) {
        super(Injetor, "CaixaPage");
        const _Parametros = Params.get();
        //ResultSet contendo os caixas disponiveis
        this.ResultSet = _Parametros.ResultSet;
        this.OnKeyEvent().subscribe((E) => {
            //ENTER
            if (E.keyCode == 13) {
                this.SelecionarCaixa();
            }
            //Esc
            else if (E.keyCode == 27) {
                this.FecharModal();
            }
        });
    }

    SelecionarCaixa() {
        //Procurando o caixa no resultSet
        if (this.ResultSet) {
            for (let i = 0; i < this.ResultSet.length; i++) {
                if (this.ResultSet[i].CC003_NR_CAIXA == this.RS.CC003_NR_CAIXA) {

                    //Fecha a tela
                    this.FecharModal(this.ResultSet[i]);
                    return;
                }
            }
        }
        this.FecharModal();
    }

    Init() {

    }

    AfterInit() {

    }

    OnDestroy() {

    }


}
