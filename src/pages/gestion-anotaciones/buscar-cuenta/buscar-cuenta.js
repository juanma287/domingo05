var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { NavController, LoadingController, PopoverController } from 'ionic-angular';
;
import { CuentaService } from '../../../services/cuenta.service';
import { HomeComercioPage } from "../../home-comercio/home-comercio";
import { ConfiguaracionesPage } from "../../configuaraciones/configuaraciones";
var BuscarCuentaPage = /** @class */ (function () {
    function BuscarCuentaPage(navCtrl, cuentaService, loading, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.cuentaService = cuentaService;
        this.loading = loading;
        this.popoverCtrl = popoverCtrl;
    }
    BuscarCuentaPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        var loader = this.loading.create({ content: 'Pocesando…', });
        loader.present().then(function () {
            _this.listaCuentasGenerales$ = _this.cuentaService.getCuentasGeneral()
                .snapshotChanges().map(function (changes) {
                return changes.map(function (c) { return (__assign({ key: c.payload.key }, c.payload.val())); });
            });
            // calculamos la cantidad de cuentas
            _this.listaCuentasGenerales$.subscribe(function (result) {
                _this.cantidad = "Cantidad de cuentas registradas: " + result.length + "";
            });
            // finalizo loader
            loader.dismiss();
        });
    };
    BuscarCuentaPage.prototype.volverHome = function () {
        this.navCtrl.push(HomeComercioPage);
    };
    BuscarCuentaPage.prototype.agregar = function () {
        //	 this.navCtrl.push(AgregarCuentaPage);
    };
    BuscarCuentaPage.prototype.editar = function (cuenta) {
        //	 this.navCtrl.push(EditarCuentaPage, {cuenta: cuenta});
    };
    BuscarCuentaPage.prototype.configuaraciones = function (myEvent) {
        var popover = this.popoverCtrl.create(ConfiguaracionesPage);
        popover.present({
            ev: myEvent
        });
    };
    BuscarCuentaPage = __decorate([
        Component({
            selector: 'page-buscar-cuenta',
            templateUrl: 'buscar-cuenta.html',
        }),
        __metadata("design:paramtypes", [NavController,
            CuentaService,
            LoadingController,
            PopoverController])
    ], BuscarCuentaPage);
    return BuscarCuentaPage;
}());
export { BuscarCuentaPage };
//# sourceMappingURL=buscar-cuenta.js.map