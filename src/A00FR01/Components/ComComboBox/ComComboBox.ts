/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 2 Corporativo                             ::
 ::  Tipo        : Component                                                   ::
 ::  Descrição   : ComboBox corporativo                                        ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 29/06/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {
    AfterContentInit,
    AfterViewInit,
    Component,
    EventEmitter,
    forwardRef,
    Input, NgZone, OnChanges, OnDestroy,
    OnInit,
    Output, SimpleChanges
} from "@angular/core";
import {CfyUtilServices} from "../../Services/CfyUtilServices";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

const CallBackNull = () => {
};

declare var $;

@Component({
    selector: 'com-combo-box',
    templateUrl: './ComComboBox.html',
    /* Ng Value accessor - Para funcionar o ngModel */
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ComComboBox),
        multi: true
    }]
})
export class ComComboBox implements OnInit, AfterContentInit, AfterViewInit, OnChanges, ControlValueAccessor, OnDestroy {

    /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
     ::  VARIAVEIS DE COMUNICAÇÃO DO COMPONENTE                                     ::
     ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
     ::  INPUTS                                                                     ::
     ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    @Input()
    sknLabelField: string;
    //Disable de campo
    @Input()
    sknDisable: boolean;
    @Input()
    sknCodeField: string;
    @Input()
    sknDescField: string;
    @Input()
    sknSwitch: string;
    @Input()
    sknDataProvider: Array<any>;

    /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
     ::  OUTPUTS                                                                    ::
     ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    @Output()
    sknOnChange: EventEmitter<any> = new EventEmitter();

    /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
     ::  VARIAVEIS INTERNAS                                                        ::
     ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    // Id utilizado para o Jquery para inicializar o component
    ID: string;
    //Valor interno utilizado no two-way data-binding
    ValorInterno: any = '';
    JqueryComponent;

    //Callbacks chamados pelo control value accessor
    onTouchedCallback: () => void = CallBackNull;
    onChangeCallback: (_: any) => void = CallBackNull;

    constructor(private Util: CfyUtilServices,
                private Zone: NgZone) {
        this.ID = Util.GenerateUUID();
    }

    ngOnInit() {
    }

    ngAfterContentInit(): void {
    }

    ngAfterViewInit(): void {
        //Inicializando o JQuery
        this.JqueryComponent = $(`#${this.ID}`);
        this.JqueryComponent.selectpicker();
        this.JqueryComponent.on("changed.bs.select", (E, NewValue) => {
            if (NewValue != null) {
                this.value = this.sknDataProvider && this.sknDataProvider.length ? this.sknDataProvider[NewValue][this.sknCodeField] : null;
            }
            else
                this.value = null;

        });
    }

    //get para o ngmodel
    get value(): any {
        return this.ValorInterno;
    }

    //set para o valor
    set value(Valor: any) {
        if (Valor !== this.ValorInterno) {
            this.ValorInterno = Valor;
            setTimeout(() => {
                this.onChangeCallback(Valor);
                if (Valor && this.sknDataProvider && this.sknDataProvider.length) {
                    for (let i = 0; i < this.sknDataProvider.length; i++) {
                        if (this.sknDataProvider[i][this.sknCodeField] == Valor) {
                            this.sknOnChange.emit(this.sknDataProvider[i]);
                            return;
                        }
                    }
                    this.sknDataProvider.find((Elemento => Elemento[this.sknCodeField] == Valor));
                }

                else if (Valor)
                    this.sknOnChange.emit();
            });
        }
    }

    ngOnChanges(Alteracoes: SimpleChanges): void {
        //Soh comuta as alterações apos a aplicação inicializar
        if (Alteracoes.sknDataProvider) {
            this.Zone.run(() => {
                //Coloca o primeiro elemento como selecionado por padrao
                if (this.sknCodeField) {
                    const _DataProvider = Alteracoes.sknDataProvider.currentValue;
                    if (_DataProvider && _DataProvider.length > 0)
                        this.value = _DataProvider[0][this.sknCodeField];
                    setTimeout(() => {
                        this.JqueryComponent.selectpicker('render');
                        this.JqueryComponent.selectpicker('refresh');
                    });

                }
            });
        }
    }

    registerOnChange(Funcao: any): void {
        this.onChangeCallback = Funcao;
    }

    registerOnTouched(Funcao: any): void {
        this.onTouchedCallback = Funcao;
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(Valor: any): void {
        if (Valor !== this.ValorInterno) {
            this.ValorInterno = Valor ? Valor.toString().trim() : Valor;
            setTimeout(() => {
                if (Valor != null)
                    this.JqueryComponent.selectpicker("val", Valor);
            });
        }
    }

    ngOnDestroy(): void {
        //Limpando o componente jquery da memoria
        if (this.JqueryComponent && this.JqueryComponent.selectpicker)
            this.JqueryComponent.selectpicker("destroy");
    }

}
