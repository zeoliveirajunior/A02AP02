/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : E00FR01 - Angular 2 corporativo                             ::
 ::  Arquivo     : SincronizacaoPage.ts                                        ::
 ::  Tipo        : Page                                                        ::
 ::  Descrição   : Tela de sincronização                                       ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2017                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, forwardRef, Inject, NgZone } from "@angular/core";
import { FacAppParameter } from "./../../Services/FacAppParameter";
import { FacDialog } from "../../Services/FacDialog";
import { FacParams } from "../../Services/FacParams";
import { ITela } from "../../Interfaces/ITela";
import { FacSincronizacao } from "../../Services/FacSincronizacao";
var SincronizacaoPage = (function (_super) {
    __extends(SincronizacaoPage, _super);
    function SincronizacaoPage(AppParameter, Dialog, Params, Zone, SincInterface, Sincronizacao) {
        var _this = _super.call(this, AppParameter, Dialog, "H02SF0105B") || this;
        _this.Params = Params;
        _this.Zone = Zone;
        _this.SincInterface = SincInterface;
        _this.Sincronizacao = Sincronizacao;
        _this.Finalizado = false;
        _this.TentarNovamente = false;
        _this.Erros = 0;
        //Recuperando os parametros da tela anterior
        _this.Parametros = _this.Params.get();
        /* Eventos de keyBind */
        _this.OnKeyEvent().subscribe(function (E) {
            //ESC
            if (E.keyCode == 27 && _this.Finalizado)
                _this.FecharModal(_this.Erros == 0);
        });
        return _this;
    }
    SincronizacaoPage.prototype.Init = function () {
        this.Sincronizar();
    };
    /**
     * Faz a sincronização novamente dos dados
     * @constructor
     */
    SincronizacaoPage.prototype.Sincronizar = function () {
        var _this = this;
        this.RegistrosOK = [];
        this.RegistrosNOK = [];
        this.Erros = 0;
        this.Finalizado = false;
        this.Sincronizacao.VerificarSincronizacao(false).then(function (ResultSet) {
            //Se não tiver resultSet, setamos a String
            if (!ResultSet || ResultSet.length == 0)
                _this.Finalizado = true;
            _this.Sincronizacao.SincronizaTabelasServidor(ResultSet).subscribe(function (Retorno) {
                var _NomeTabela = Retorno.Tabela;
                var _Status = Retorno.Status;
                //Iniciando a sincronização
                if (_Status == 1) {
                    _this.RegistrosNOK.push({
                        XX933_VC_TABELA: _NomeTabela
                    });
                }
                else {
                    _this.Zone.run(function () {
                        //Procura pelo objeto no resultSet antigo;
                        for (var i = 0; i < _this.RegistrosNOK.length; i++) {
                            if (_this.RegistrosNOK[i].XX933_VC_TABELA == _NomeTabela) {
                                var _ObjetoAtual = _this.RegistrosNOK[i];
                                //Verificando as linhas
                                _ObjetoAtual.Linhas = Retorno.Linhas != null ? Retorno.Linhas + " Registro(s)" : null;
                                //Verificando erros
                                _ObjetoAtual.Error = Retorno.Error != null ? Retorno.Error.toString() : null;
                                _this.RegistrosOK.push(_ObjetoAtual);
                                //Remove o elemento do pending
                                _this.RegistrosNOK.splice(i, 1);
                                //Totalizando os erros
                                _this.Erros += Retorno.Error ? 1 : 0;
                                return;
                            }
                        }
                    });
                }
            }, function (Error) {
            }, function () {
                //Roda quando a operação finalizar
                _this.Finalizado = true;
                //Se não houve erros, fechamos a tela e continuamos para a tela principal
                if (_this.Erros == 0) {
                    _this.SincInterface.SalvaSincronizacao().then(function () {
                        //Se veio a requisição para fechar a tela, então fechamos
                        if (_this.Parametros.FecharAoConcluir)
                            _this.FecharModal(true);
                    }).catch(function (Error) {
                        if (_this.Parametros.FecharAoConcluir)
                            _this.FecharModal(true);
                    });
                }
                else {
                    //Setando os parametros de erros
                    _this.ParamErros = {
                        "Erros": _this.Erros
                    };
                }
            });
        }).catch(function (Error) {
            _this.Finalizado = true;
            _this.Erros = 1;
            //Setando os parametros de erros
            _this.ParamErros = {
                "Erros": _this.Erros
            };
            _this.Dialog.GenerateError(Error);
        });
    };
    SincronizacaoPage.prototype.AfterInit = function () {
    };
    SincronizacaoPage.prototype.OnDestroy = function () {
        //Limpando as variaveis
        this.Parametros = null;
    };
    return SincronizacaoPage;
}(ITela));
SincronizacaoPage = __decorate([
    Component({
        selector: 'sincronizacao-page',
        templateUrl: 'SincronizacaoPage.html',
        styleUrls: ["SincronizacaoPage.css"]
    }),
    __param(4, Inject("ISincronizacao")),
    __param(5, Inject(forwardRef(function () { return FacSincronizacao; }))),
    __metadata("design:paramtypes", [FacAppParameter,
        FacDialog,
        FacParams,
        NgZone, Object, FacSincronizacao])
], SincronizacaoPage);
export { SincronizacaoPage };
//# sourceMappingURL=SincronizacaoPage.js.map