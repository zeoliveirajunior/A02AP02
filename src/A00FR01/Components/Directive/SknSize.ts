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

import {Directive, HostBinding, Input, OnInit} from '@angular/core';

@Directive({
    selector: '[sknSize]',
})
export class SknSize implements OnInit {

    @Input()
    sknSize: number;
    @Input()
    sknOffSet: string;

    @HostBinding('class')
    Classe = "col-12";

    constructor() {
    }

    ngOnInit(): void {
        if (this.sknSize)
            this.Classe = `col-${this.sknSize}`;
    }


}
