/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 ::  Empresa     : Cloudfy                                                     ::
 ::  Systema     : A00FR01 - Angular corporativo                               ::
 ::  Tipo        : Serviço                                                     ::
 ::  Descrição   : Serviço de utilizado para validações padroes                ::
 ::----------------------------------------------------------------------------::
 ::  Programador : José Carlos de Oliveira Junior                              ::
 ::  Data        : 04/01/2018                                                  ::
 ::  Alteração   : Primeira versão                                             ::
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

import {Injectable} from "@angular/core";
import {IValidator} from "../Interfaces/IValidator";

/*
 Funcionalidades de Validação
 */
@Injectable({
    providedIn: 'root'
})
export class CfyValidationService {

    // Converte uma string em um objeto json
    ValidaEmail(Email: string): string {
        if (!Email || !Email.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i))
            return 'FACVALIDATION_ERROR_EMAIL';
        return null;
    }

    /**
     * @ngdoc method
     * @name Validation
     * @methodOf H00FR04.service:FacValidation
     * @description
     *
     * Faz a validação de um componente de formulario. Por exemplo, passamos o scope de um com-text-field, e será
     * validado todos os requisitos deste textfield, como se ele está vazio e é requerido, se a validação de mascara
     * está ok(CPF ou CNPF). Este método é utilizado internamente no framework.
     *
     * @param {Object} Scope Scope do componente(com-text-field, com-date-picker, com-combo-box...)
     * @param {String} Field Nome do field a ser validado. Ex: AD010_VC_USR.
     * @returns {Boolean} true se valido, e false se possui inconsistências.
     */
    Validation(Component: any, Value, LabelField: string): boolean {
        Component.sknErrorMessage = undefined;

        if (!this.MaskValidation(Component, Value, LabelField))
            return false;
        //validate min length
        if (Component.sknMinLength && (!Value || Value.length < Component.sknMinLength)) {
            /*$translate("FACVALIDATION_MIN_VALUE", {minLength: Scope.sknMinLength}).then(function (Traduction) {
             Scope.sknErrorMessage = Traduction;
             });*/
            Component.sknErrorMessage = `Campo ${LabelField} precida ter no minimo ${Component.sknMinLength}`;
            return false;
        }
        //checking the required field
        if (Component.sknRequired && !Value) {
            Component.sknErrorMessage = `Campo ${LabelField} deve ser preenchido`;
            return false;
        }
        return true;

    }

    /**
     * @ngdoc method
     * @name MaskValidation
     * @methodOf H00FR04.service:FacValidation
     * @description
     *
     * Faz a validação de um componente de formulário, porem apenas verifica a mascara. É utilizado
     * pelo método validation, que faz a validação completa do componente. Por exemplo, caso
     * tenhamos um campo com mascara de CPF, esse método irá validar se o CPF preenchido é
     * valido ou não.
     *
     * @param {Object} Scope Scope do componente(com-text-field, com-date-picker, com-combo-box...)
     * @param {String} Field Nome do field a ser validado. Ex: AD010_VC_USR.
     * @returns {Boolean} true se valido, e false se possui inconsistências.
     */
    MaskValidation(Component: IValidator, Value: any, LabelField: string): boolean {
        let _ValidationFunction;
        let _Mask = Component.getMask();

        if (!Component.getMask())
            return true;
        switch (_Mask.toLowerCase()) {
            case "cep":
            case "rg":
                _ValidationFunction = this.CEPValidation;
                break;
            case "phone":
                _ValidationFunction = this.PhoneValidation;
                break;
            case "cpf":
                _ValidationFunction = this.CPFValidation;
                break;
            case "cnpj":
                _ValidationFunction = this.CNPJValidation;
                break;
            case "cpfcnpj":
                if (!Value)
                    return true;
                Value = Value.replace(/[^\d]+/g, '');
                if (Value.length > 11)
                    _ValidationFunction = this.CNPJValidation;
                else
                    _ValidationFunction = this.CPFValidation;
                break;
            default:
                return true;
        }
        if (_ValidationFunction(Value))
            return true;
        else {
            Component.sknErrorMessage = `Campo ${LabelField} é invalido`;
            return false;
        }
    }

    /**
     * @ngdoc method
     * @name CEPValidation
     * @methodOf H00FR04.service:FacValidation
     * @description
     *
     * Faz validação de CEP.
     *
     * Exemplo de utilização:
     *
     * <pre>
     *
     *         function ControllerFunction($scope, FacValidation) {
   *            //Cep é valido.
   *            if (FacValidation.CEPValidation("81750000"))
   *              console.log("O CEP é valido!");
   *            else
   *              console.log("O CEP é invalido");
   *         }
     *
     * </pre>
     *
     * @param {String} Value CEP(com mascara ou sem). <br><br><strong>Ex: "81750000"</strong>
     * @returns {Boolean} true se valido, e false se possui inconsistências.
     */
    CEPValidation(Value) {
        let _RegularExpression;

        if (Value && Value !== "") {
            _RegularExpression = new RegExp("^([0-9]{8})$");
            if (_RegularExpression.test(Value))
                return true;
            else
                return false;
        }
        return true;
    }

    /**
     * @ngdoc method
     * @name PhoneValidation
     * @methodOf H00FR04.service:FacValidation
     * @description
     *
     * Faz validação de telefone + DDD.
     *
     * Exemplo de utilização:
     *
     * <pre>
     *
     *         function ControllerFunction($scope, FacValidation) {
   *            //telefone é valido.
   *            if (FacValidation.PhoneValidation("4198040998"))
   *              console.log("O telefone é valido!");
   *            else
   *              console.log("O telefone é invalido");
   *         }
     *
     * </pre>
     *
     * @param {String} Telefone Telefone+DDD(com mascara ou sem). <br><br><strong>Ex: "4198040998"</strong>
     * @returns {Boolean} true se valido, e false se possui inconsistências.
     */
    PhoneValidation(Value) {
        let _RegularExpression;

        if (Value && Value !== "") {
            _RegularExpression = new RegExp("^([0-9]{10,11})$");
            if (_RegularExpression.test(Value))
                return true;
            else
                return false;
        }
        return true;
    }

    /**
     * @ngdoc method
     * @name CPFCNPJValidation
     * @methodOf H00FR04.service:FacValidation
     * @description
     *
     * Faz validação de CPF ou CNPJ, dependendo do tamanho da String.
     *
     * Exemplo de utilização:
     *
     * <pre>
     *
     *         function ControllerFunction($scope, FacValidation) {
  *            //CPF/CNPJ é valido.
  *            if (FacValidation.CPFCNPJValidation("05618847906"))
  *              console.log("O CPF/CNPJ é valido!");
  *            else
  *              console.log("O CPF/CNPJ é invalido!");
  *         }
     *
     * </pre>
     *
     * @param {String} CPFCNPJ CPF/CNPJ(com mascara ou sem). <br><br><strong>Ex: "05618847906" ou "16646467000143"</strong>
     * @returns {Boolean} true se valido, e false se possui inconsistências.
     */
    CPFCNPJValidation(Value) {
        if (!Value)
            return true;
        if (!(Value instanceof String))
            Value = Value.toString();
        //Removendo tudo que não seja numeros


    }

    /**
     * @ngdoc method
     * @name CNPJValidation
     * @methodOf H00FR04.service:FacValidation
     * @description
     *
     * Faz validação de CNPJ.
     *
     * Exemplo de utilização:
     *
     * <pre>
     *
     *         function ControllerFunction($scope, FacValidation) {
   *            //CNPJ é valido.
   *            if (FacValidation.CNPJValidation("16646467000143"))
   *              console.log("O CNPJ é valido!");
   *            else
   *              console.log("O CNPJ é invalido!");
   *         }
     *
     * </pre>
     *
     * @param {String} CNPJ CNPJ(com mascara ou sem). <br><br><strong>Ex: "16646467000143"</strong>
     * @returns {Boolean} true se valido, e false se possui inconsistências.
     */
    CNPJValidation(CNPJ) {
        if (!CNPJ) return true;

        CNPJ = CNPJ.replace(/[^\d]+/g, '');

        if (!CNPJ) return false;

        if (CNPJ.length != 14)
            return false;

        // Elimina CNPJs invalidos conhecidos
        if (CNPJ == "00000000000000" ||
            CNPJ == "11111111111111" ||
            CNPJ == "22222222222222" ||
            CNPJ == "33333333333333" ||
            CNPJ == "44444444444444" ||
            CNPJ == "55555555555555" ||
            CNPJ == "66666666666666" ||
            CNPJ == "77777777777777" ||
            CNPJ == "88888888888888" ||
            CNPJ == "99999999999999")
            return false;

        // Valida DVs
        let _rTamanho = CNPJ.length - 2;
        let _rNumeros = CNPJ.substring(0, _rTamanho);
        let _rDigitos = CNPJ.substring(_rTamanho);
        let _rSoma = 0;
        let _rPos = _rTamanho - 7;
        for (var i = _rTamanho; i >= 1; i--) {
            _rSoma += _rNumeros.charAt(_rTamanho - i) * _rPos--;
            if (_rPos < 2)
                _rPos = 9;
        }
        let _rResultado = _rSoma % 11 < 2 ? 0 : 11 - _rSoma % 11;
        if (_rResultado != _rDigitos.charAt(0))
            return false;

        _rTamanho = _rTamanho + 1;
        _rNumeros = CNPJ.substring(0, _rTamanho);
        _rSoma = 0;
        _rPos = _rTamanho - 7;
        for (i = _rTamanho; i >= 1; i--) {
            _rSoma += _rNumeros.charAt(_rTamanho - i) * _rPos--;
            if (_rPos < 2)
                _rPos = 9;
        }
        _rResultado = _rSoma % 11 < 2 ? 0 : 11 - _rSoma % 11;
        if (_rResultado != _rDigitos.charAt(1))
            return false;

        return true;
    }

    /**
     * @ngdoc method
     * @name CPFValidation
     * @methodOf H00FR04.service:FacValidation
     * @description
     *
     * Faz validação de CPF.
     *
     * Exemplo de utilização:
     *
     * <pre>
     *
     *         function ControllerFunction($scope, FacValidation) {
   *            //CPF é valido.
   *            if (FacValidation.CPFValidation("05618847906"))
   *              console.log("O CPF é valido!");
   *            else
   *              console.log("O CPF é invalido!");
   *         }
     *
     * </pre>
     *
     * @param {String} CPF CPF(com mascara ou sem). <br><br><strong>Ex: "05618847906"</strong>
     * @returns {Boolean} true se valido, e false se possui inconsistências.
     */
    CPFValidation(Value) {
        let _RegularExpression;
        let _Sum;
        let _Rest;
        let i;


        if (Value && Value !== "") {
            _RegularExpression = new RegExp("^([0-9]{11})$");
            if (!_RegularExpression.test(Value))
                return false;
        }
        else
            return true;

        // Elimina CPFS invalidos conhecidos
        if (Value == "00000000000" ||
            Value == "11111111111" ||
            Value == "22222222222" ||
            Value == "33333333333" ||
            Value == "44444444444" ||
            Value == "55555555555" ||
            Value == "66666666666" ||
            Value == "77777777777" ||
            Value == "88888888888" ||
            Value == "99999999999")
            return false;

        _Sum = 0;

        for (i = 1; i <= 9; i++)
            _Sum = _Sum + parseInt(Value.substring(i - 1, i)) * (11 - i);

        _Rest = (_Sum * 10) % 11;

        if ((_Rest == 10) || (_Rest == 11))
            _Rest = 0;

        if (_Rest != parseInt(Value.substring(9, 10)))
            return false;
        _Sum = 0;

        for (i = 1; i <= 10; i++)
            _Sum = _Sum + parseInt(Value.substring(i - 1, i)) * (12 - i);

        _Rest = (_Sum * 10) % 11;

        if ((_Rest == 10) || (_Rest == 11))
            _Rest = 0;

        if (_Rest != parseInt(Value.substring(10, 11)))
            return false;

        return true;
    }


}
