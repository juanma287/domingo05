var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { NavController, PopoverController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { ConfiguaracionesPage } from "../configuaraciones/configuaraciones";
import { CuentaPage } from "../gestion-cuentas/cuenta/cuenta";
import { ClientePage } from "../gestion-clientes/cliente/cliente";
import { ProductoPage } from "../gestion-productos/producto/producto";
import { BuscarCuentaPage } from "../gestion-anotaciones/buscar-cuenta/buscar-cuenta";
var HomeComercioPage = /** @class */ (function () {
    function HomeComercioPage(storage, nav, popoverCtrl) {
        var _this = this;
        this.storage = storage;
        this.nav = nav;
        this.popoverCtrl = popoverCtrl;
        this.storage.get('usuario').then(function (val) {
            _this.usuario = val;
        });
    }
    // Se ejecuta cuando entras en una página, antes de cargarla. Utilízalo para tareas que se deben realizar siempre que entras
    HomeComercioPage.prototype.ionViewWillEnter = function () {
    };
    HomeComercioPage.prototype.gestionMenuComercio = function (home) {
        switch (home) {
            case 'anotar': {
                // mostramos el home de cuenta
                this.nav.push(BuscarCuentaPage);
                break;
            }
            case 'cuenta': {
                // mostramos el home de clientes
                this.nav.push(CuentaPage);
                break;
            }
            case 'cliente': {
                // mostramos el home de clientes
                this.nav.push(ClientePage);
                break;
            }
            case 'producto': {
                // mostramos el home de productos
                this.nav.push(ProductoPage);
                break;
            }
        }
    };
    HomeComercioPage.prototype.configuaraciones = function (myEvent) {
        var popover = this.popoverCtrl.create(ConfiguaracionesPage);
        popover.present({
            ev: myEvent
        });
    };
    HomeComercioPage = __decorate([
        Component({
            selector: 'page-home-comercio',
            templateUrl: 'home-comercio.html',
        }),
        __metadata("design:paramtypes", [Storage, NavController, PopoverController])
    ], HomeComercioPage);
    return HomeComercioPage;
}());
export { HomeComercioPage };
//
//# sourceMappingURL=home-comercio.js.map