/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 2 Corporativo                             ::
 ::  Tipo        : Component                                                   ::
 ::  Descrição   : Componente para linhas                                      ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 29/06/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Directive, ElementRef, HostBinding, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {CfyUtilServices} from "../../Services/CfyUtilServices";

declare var $;

@Directive({
    selector: '[comButton]',
})
export class ComButton implements OnInit, OnChanges {

    @Input()
    sknColor: string;
    @Input()
    sknIcon: string;
    @Input()
    sknText: string;

    @HostBinding('class')
    Classe;

    constructor(private Elemento: ElementRef,
                private Util: CfyUtilServices,
                private Renderizador: Renderer2) {

    }

    ngOnInit(): void {
    }

    ngOnChanges(Changes: SimpleChanges): void {
        if (Changes.sknColor)
            this.sknColor = Changes.sknColor.currentValue;
        this.getColor();
        if (Changes.sknText) {
            this.Elemento.nativeElement.innerHTML = this.Util.GetTranslation(this.sknText);
        }
        //Adicionando a tag
        if (Changes.sknIcon) {
            this.Classe = this.Classe.toString().replace('m-btn--icon', "");
            if (Changes.sknIcon.currentValue) {
                this.Classe = `${this.Classe.toString()} m-btn--icon`;
                const _Elemento = $.parseHTML(`<span><i class="fa ${Changes.sknIcon.currentValue}"></i><span>${this.Util.GetTranslation(this.sknText)}</span></span>`);
                this.Elemento.nativeElement.innerHTML = '';
                this.Renderizador.appendChild(this.Elemento.nativeElement, _Elemento[0]);
            }
        }
    }

    getColor() {
        let _StrCompleta = "btn m-btn ";
        if (this.sknColor) {
            switch (this.sknColor.toLowerCase()) {
                case "primary" :
                    _StrCompleta += "btn-primary";
                    break;
                case "secondary" :
                    _StrCompleta += "btn-secondary";
                    break;
                case "warning" :
                    _StrCompleta += "btn-warning";
                    break;
                case "danger" :
                    _StrCompleta += "btn-danger";
                    break;
                default:
                    _StrCompleta += this.sknColor;
                    break;
            }
        }
        this.Classe = _StrCompleta;
    }


}
