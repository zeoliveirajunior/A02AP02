/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular 6 corporativo                             ::
 ::  Tipo        : Serviço                                                     ::
 ::  Descrição   : Singleton de parametros da aplicação                        ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Injectable, ViewContainerRef} from '@angular/core';
import {Enviroment} from '../Interfaces/Enviroment';
import {UserParameter} from '../Interfaces/UserParameter';
import {Observable} from "rxjs/internal/Observable";

declare var $;

@Injectable()
export class AppParameters {

    /**
     * Arquivo com a configuração do banco de dados
     */
    Database: any;

    /**
     * Variaveis de ambiente utilizadas na inicialização
     */
    Ambiente: Enviroment;

    /**
     * Token de autenticação
     */
    AutToken: string;

    /**
     * Nivel do log para o componente de logs
     * Quanto maior o nivel do log, mais analitico
     * @type {number}
     */
    LogLevel: number = 4;

    AfterLogin: (User: UserParameter) => void;

    UsuarioLogado: UserParameter;

    Switches: any;

    /**
     * Guarda o container principal da aplicação para criar modais
     */
    ContainerPrincipal: ViewContainerRef;

    /**
     * Habilitando o evento de key (Utilizado para alerts e modais)
     * @type {boolean}
     */
    EnableKeyEvent: boolean = true;

    /**
     * Telas modais empilhadas
     * @type {any[]}
     */
    PilhaTelas: Array<any> = [];

    /**
     * Evento global de keyBindind
     */
    private RegisterForKey: Observable<any>;

    /**
     * Parametros de sincronização
     */
    ParametrosSincronizacao;

    constructor() {

    }

    /**
     * Tela Atual
     */
    setTelaAtual(TelaAtual: string) {
        //Adiciona a tela atual na pilha
        this.PilhaTelas.push(TelaAtual);
    }

    /**
     * Retornando a tela atual
     * @returns {any}
     */
    getTelaAtual(): string {
        let _TelaAtual;
        if (this.PilhaTelas.length > 0)
            _TelaAtual = this.PilhaTelas[this.PilhaTelas.length - 1];
        else
            _TelaAtual = null;
        return _TelaAtual;
    }

    /**
     * Remove a tela da pilha
     * @param Tela
     * @constructor
     */
    RemoveTela(Tela: string) {
        //Procurando a ultima referencia na tela
        for (let i = this.PilhaTelas.length; i != 0; i--) {
            if (this.PilhaTelas[i] == Tela) {
                //Removendo a tela
                this.PilhaTelas.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Recupera todos os eventos de keypress da aplicação
     * @returns {Observable<any>}
     * @constructor
     */
    RegisterForKeyEvents(): Observable<any> {
        if (!this.RegisterForKey)
            this.RegisterForKey = new Observable<any>((Observer) => {
                $(document).keyup((E) => {
                    Observer.next(E);
                });
            });
        return this.RegisterForKey;
    }

    isLogged() {
        return this.AutToken != null;
    }
}
