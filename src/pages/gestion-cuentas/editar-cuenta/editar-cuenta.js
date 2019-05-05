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
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { CuentaService } from '../../../services/cuenta.service';
import { CuentaPage } from "../cuenta/cuenta";
import { ConfiguaracionesPage } from "../../configuaraciones/configuaraciones";
var EditarCuentaPage = /** @class */ (function () {
    function EditarCuentaPage(navCtrl, navParams, cuentaService, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.cuentaService = cuentaService;
        this.popoverCtrl = popoverCtrl;
    }
    EditarCuentaPage.prototype.ionViewWillLoad = function () {
        this.cuenta = this.navParams.get('cuenta');
    };
    EditarCuentaPage.prototype.actualizar = function (cuenta) {
        var _this = this;
        this.cuentaService.actualizar(cuenta).then(function () {
            // acutalizamos tambien la info en cuenta-general
            _this.cuentaService.actualizarCuentaGeneral(cuenta.key, cuenta.nombre);
            _this.navCtrl.setRoot(CuentaPage);
        });
    };
    EditarCuentaPage.prototype.eliminar = function (cuenta) {
        var _this = this;
        this.cuentaService.eliminar(cuenta).then(function () {
            _this.cuentaService.eliminarCuentaGeneral(cuenta.key);
            _this.navCtrl.setRoot(CuentaPage);
        });
    };
    EditarCuentaPage.prototype.configuaraciones = function (myEvent) {
        var popover = this.popoverCtrl.create(ConfiguaracionesPage);
        popover.present({
            ev: myEvent
        });
    };
    EditarCuentaPage = __decorate([
        Component({
            selector: 'page-editar-cuenta',
            templateUrl: 'editar-cuenta.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            CuentaService,
            PopoverController])
    ], EditarCuentaPage);
    return EditarCuentaPage;
}());
export { EditarCuentaPage };
//# sourceMappingURL=editar-cuenta.js.map