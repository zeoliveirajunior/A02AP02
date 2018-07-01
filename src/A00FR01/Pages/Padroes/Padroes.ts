/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 2 Corporativo                             ::
 ::  Tipo        : Tela                                                        ::
 ::  Descrição   : Tela padrão para seleção de empresa/filial                  ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 29/06/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Component, Injector, NgZone} from '@angular/core';
import {CfyParams} from "../../Services/CfyParams";
import {ITela} from "../../Interfaces/ITela";

@Component({
    selector: 'cfy-padroes',
    templateUrl: 'Padroes.html'
})
export class CfyPadroes  extends ITela {

    ArrayEmpresas: Array<any>;

    Empresas: Array<any>;

    Filiais: Array<any>;

    EmpresaSelecionada;

    FilialSelecionada;

    constructor(InjectService: Injector,
                private Parametros: CfyParams,
                private Zone: NgZone) {
        super(InjectService, "Padroes");
        /* Criando os eventos de keyBind */
        this.OnKeyEvent().subscribe((E) => {
            if (E.keyCode == 13) {
                this.Zone.run(() => {
                    this.Selecionar();
                });
            }
        });
        this.ArrayEmpresas = Parametros.get();
        this.AgruparResultSet();
    }

    AgruparResultSet() {
        this.Empresas = [];
        if (this.ArrayEmpresas) {
            let _ElementoAtual;
            this.ArrayEmpresas.forEach((Elemento) => {
                if (_ElementoAtual == null || _ElementoAtual.CompanyNumber != Elemento.CompanyNumber) {
                    _ElementoAtual = Elemento;
                    _ElementoAtual.Filiais = [];
                    this.Empresas.push(_ElementoAtual);
                }
                _ElementoAtual.Filiais.push(Elemento);
            });
            if (this.Empresas.length)
                this.Filiais = this.Empresas[0].Filiais;
        }
    }

    OnChangeEmpresa(EmpresaSelecionada) {
        if (EmpresaSelecionada)
            this.Filiais = EmpresaSelecionada.Filiais;
    }

    Selecionar() {
        if (this.EmpresaSelecionada == null || this.FilialSelecionada == null) {
            this.Dialog.ShowErrorNotification("CFYPADROES_ERRO_SELECAO_EMPRESA_FILIAL");
            return;
        }
        //Procurando a filial
        const _Empresa = this.ArrayEmpresas.find(
            (Elemento) => Elemento.CompanyNumber == this.EmpresaSelecionada && Elemento.BranchNumber == this.FilialSelecionada ? Elemento : undefined)
        this.FecharModal(_Empresa);
    }

    AfterInit() {}

    Init() {}

    OnDestroy() {}

}
