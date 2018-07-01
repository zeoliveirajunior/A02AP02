/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : M00FR01 - Mobile Ionic 2                                    ::
 ::  Arquivo     : FacUtil.ts                                                  ::
 ::  Tipo        : Service                                                     ::
 ::  Descrição   : Funcionalidades genericas                                   ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Injectable} from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import {ConSwitchCorp} from './../Constants/ConSwitch';
import {AppParameters} from './AppParameters';
import {TranslateService} from '@ngx-translate/core';

declare var $: any;

/*
 Funcionalidades de modal e notificações
 */
@Injectable()
export class CfyUtilServices {


    constructor(private AppParameter: AppParameters,
                private Translate: TranslateService) {

    }

    /**
     * Recupera o ID unico da maquina
     */
    getMachineUUID(): string {
        return 'Navegador';
    }

    /**
     * Recupera os switches
     */
    getSwitches(NomeSwitch: string): Array<any> {
        //Primeiramente pesquisamos nos switches corporativos
        let _Switch = ConSwitchCorp.SwitchCorp[NomeSwitch];
        if (_Switch && _Switch.length > 0)
            return _Switch;
        //Procuramos nos switches da aplicação
        _Switch = this.AppParameter.Switches[NomeSwitch];
        if (_Switch && _Switch.length > 0)
            return _Switch;
        throw new Error('Switch ' + NomeSwitch + ' não encontrado');
    }

    /**
     * Recupera um switch pelo nome
     */
    getSwitch(NomeSwitch: string, CD: string): string {
        const _Switch = this.getSwitches(NomeSwitch);
        for (let i = 0; i < _Switch.length; i++) {
            if (_Switch[i].CD == CD)
                return _Switch[i].DS;
        }
        return 'Código ' + CD + ' não encontrado';
    }

    /**
     * Gera um md5 da string
     * @param Valor
     * @constructor
     */
    Md5(Valor: string): string {
        const _Valor = Md5.hashStr(Valor);
        return typeof _Valor === 'string' ? _Valor : (<any>_Valor).toString();
    }

    /**
     * @ngdoc method
     * @name GenerateUUID
     * @methodOf H00FR04.service:FacUtil
     * @description
     *
     * Gera um ID alfanumerico randomico de 32 bytes. Este método pode ser utilizado para gerar um ID para um componente
     * criado dinamicanente, ou para trabalhar com o componente de multiselect para insert na tabela 920.
     */
    GenerateUUID() {
        let _Date = new Date().getTime();
        if (window.performance && typeof window.performance.now === 'function') {
            _Date += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (_Date + Math.random() * 16) % 16 | 0;
            _Date = Math.floor(_Date / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    /**
     * Recupera o CSS padrão dos componentes
     * @param Length
     * @param OffSet
     * @constructor
     */
    GetColumnCSS(Length: number, OffSet?): Array<string> {
        const _Return = ['m-grid-col-md-' + (Length ? Length : '12')];
        if (OffSet)
            _Return.push('m-grid-col-md-offset-' + OffSet);
        return _Return;
    }


    /**
     * Verifica a permissão das telas
     */
    public VerificaPermissaoTela(Tela: string): number {
        if (!this.AppParameter.UsuarioLogado)
            return 0;
        if (this.AppParameter.UsuarioLogado.TransactionList.length > 0) {
            for (let i = 0; i < this.AppParameter.UsuarioLogado.TransactionList.length; i++) {
                if (this.AppParameter.UsuarioLogado.TransactionList[i] == Tela)
                    return 30;
            }
        }
        return 0;

    }

    // Converte uma string em um objeto json
    public fromJson(ReturnString: string) {
        try {
            return JSON.parse(ReturnString);
        } catch (E) {
            return null;
        }
    }

    /**
     * Converte um objeto json em uma classe typescript
     * @param Classe
     * @param JsonObject
     */
    public toClassFromJson<T>(Classe: T, JsonObject: string | any): T {
        //Se vier uma string, convertemos para json
        if (typeof JsonObject == 'string')
            JsonObject = this.fromJson(JsonObject);

        for (const Property in JsonObject)
            Classe[Property] = JsonObject[Property];
        return Classe;
    }

    /**
     * Converte uma classe em um objeto json
     * @param Classe
     * @param JsonObject
     */
    public toJsonFromClass(Classe, JsonObject?: any): any {
        if (!JsonObject)
            JsonObject = {};
        for (const Property in Classe) {
            JsonObject[Property] = Classe[Property];
        }
        return JsonObject;
    }

    /**
     * Converte um objeto para json
     * @param Object
     * @returns {string}
     */
    public toJson(Object: any) {
        return JSON.stringify(Object);
    }

    /**
     * Completa o numero
     */
    CompletaValor(Valor: string, ValorAcompletar: string, Quantidade: number): string {
        for (let i = 0; i < Quantidade; i++) {
            Valor += ValorAcompletar;
        }
        return Valor;
    }

    /**
     * Faz uma copia do objeto
     */
    Copy(Source: any) {
        return Object.assign({}, Source);
    }

    // Converte uma mensagem de sp em um valor
    public GetTranslation(Message: string, ...Values: any[]) {
        let _Message: string;
        let _Values: any[];
        if (Values && Values.length > 0) {
            _Message = Message;
            _Values = Values;
        } else {
            const _JSONObj = this.fromJson(Message);
            if (_JSONObj) {
                _Message = _JSONObj.Message;
                // Se teve parametros de retorno, então adicionamos os parametros nos valores
                if (_JSONObj.Parameters)
                    _Values = _JSONObj.Parameters;
            } else
                _Message = Message;
        }
        return this.Translate.instant(_Message, _Values);
    }

    /**
     * Verifica se o objeto é um array
     * @param Obj
     * @returns {boolean}
     */
    isArray(Obj) {
        return !!Obj && Obj.constructor === Array;
    }

    /**
     * Verifica se a variavel eh um objeto
     * @param Obj
     * @returns {boolean}
     */
    isObject(Obj) {
        return Obj !== null && typeof Obj === 'object';
    }


    DownloadFile(URL, FileName?) {
        //Checando se a tag download é suportada
        //var _A = document.createElement('a');
        if (!FileName)
            FileName = URL.substring(URL.lastIndexOf('/') + 1);
        /*if (typeof _A.download != "undefined") {
         _A.href = encodeURI(URL);
         _A.target = '_blank';
         _A.download = FileName;
         document.body.appendChild(_A);
         _A.click();
         setTimeout(() => {
         _A.click();
         document.body.removeChild(_A);
         },300);
         /!*!//Cria um elemento link, e chama o evento de clic
         var _Anchor = angular.element('<a/>');
         _Anchor.attr({
         href: encodeURI(URL),
         target: '_blank',
         download: FileName
         })[0].click();*!/
         }
         else {*/
        window.open(URL, '_blank');
        //win.location.href = URL;
        //}
    }
}
