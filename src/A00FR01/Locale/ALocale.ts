/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Arquivo     : ALocale.ts                                                  ::
 ::  Tipo        : Classe abstrata                                             ::
 ::  Descrição   : Representação da carga de translate                         ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


import {TranslateService} from '@ngx-translate/core';
import {TranslateCorpPTBR} from './TranslateCorpPTBR';


export abstract class ALocale {

    Translate: TranslateService;

    constructor(Translate: TranslateService) {
        this.Translate = Translate;
    }

    public setLanguage(Language = 'pt_br') {
        this.Translate.setDefaultLang(Language);
        this.Translate.use(Language);
    }

    public Load() {
        //Corporativo
        this.setTranslate(new TranslateCorpPTBR().AddLanguage());
        this.PTBR();
    }

    protected abstract PTBR();

    protected setTranslate(Json: any, Language = 'pt_br') {
        this.Translate.setTranslation(Language, Json, true);
    }


}

export interface ILocale {
    AddLanguage();
}
