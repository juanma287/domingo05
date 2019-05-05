var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { CuentaService } from '../../../services/cuenta.service';
import { CuentaPage } from "../cuenta/cuenta";
import { ConfiguaracionesPage } from "../../configuaraciones/configuaraciones";
import { DatePipe } from '@angular/common';
var AgregarCuentaPage = /** @class */ (function () {
    function AgregarCuentaPage(navCtrl, navParams, cuentaService, alertCtrl, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.cuentaService = cuentaService;
        this.alertCtrl = alertCtrl;
        this.popoverCtrl = popoverCtrl;
        this.cuenta = {
            id_cliente: '',
            nombre: '',
            observacion: '',
            total_deuda: 0,
            fecha_ultimo_pago: '',
            fecha_ultimo_pago_number: 0,
            fecha_alta: '',
            fecha_alta_number: 0
        };
        this.cuenta_general = {
            id_cliente: '',
            id_comercio: '',
            nombre: '',
            total_deuda: 0,
            fecha_ultimo_pago: '',
            fecha_ultimo_pago_number: 0,
            fecha_alta: '',
            fecha_alta_number: 0
        };
        this.pipe = new DatePipe('es');
        this.hoy = new Date().getTime();
        // a la fecha tambien la guardamos como número para luego poder manipularla en los filtrados
        this.cuenta.fecha_alta = this.pipe.transform(this.hoy, 'dd/MM/yyyy');
        this.cuenta.fecha_alta_number = this.hoy;
        this.cuenta_general.fecha_alta = this.cuenta.fecha_alta;
        this.cuenta_general.id_comercio = this.cuentaService.usuario.id_comercio;
        console.log(this.cuenta.fecha_alta);
        console.log(this.hoy);
    }
    AgregarCuentaPage.prototype.agregar = function (cuenta) {
        var _this = this;
        var estadoConexion = this.cuentaService.estadoConex;
        if (estadoConexion) {
            this.cuentaService.agregar(cuenta).then(function (ref) {
                // luego de que el comercio crea una cuenta, la misma se replica en la lista de cuentas generales
                _this.cuenta_general.nombre = cuenta.nombre;
                _this.cuentaService.agregarCuentaGeneral(ref.key, _this.cuenta_general);
                _this.navCtrl.setRoot(CuentaPage);
            });
        }
        else {
            var alert_1 = this.alertCtrl.create({
                title: 'Error: sin conexión',
                subTitle: 'Para realizar la operación conéctese y vuelva a intentarlo',
                buttons: ['OK']
            });
            alert_1.present();
        }
    };
    AgregarCuentaPage.prototype.onChange = function (value) {
        console.log(value);
    };
    AgregarCuentaPage.prototype.configuaraciones = function (myEvent) {
        var popover = this.popoverCtrl.create(ConfiguaracionesPage);
        popover.present({
            ev: myEvent
        });
    };
    AgregarCuentaPage = __decorate([
        Component({
            selector: 'page-agregar-cuenta',
            templateUrl: 'agregar-cuenta.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            CuentaService,
            AlertController,
            PopoverController])
    ], AgregarCuentaPage);
    return AgregarCuentaPage;
}());
export { AgregarCuentaPage };
//# sourceMappingURL=agregar-cuenta.js.map