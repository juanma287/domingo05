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
import { ProductoService } from '../../../services/producto.service';
import { ProductoPage } from "../producto/producto";
import { ConfiguaracionesPage } from "../../configuaraciones/configuaraciones";
var AgregarProductoPage = /** @class */ (function () {
    function AgregarProductoPage(navCtrl, navParams, productoService, alertCtrl, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.productoService = productoService;
        this.alertCtrl = alertCtrl;
        this.popoverCtrl = popoverCtrl;
        this.producto = {
            nombre: '',
            descripcion: '',
            precio: 0,
            unidad: ''
        };
    }
    AgregarProductoPage.prototype.agregar = function (producto) {
        var _this = this;
        var estadoConexion = this.productoService.estadoConex;
        if (estadoConexion) {
            this.productoService.agregar(producto).then(function (ref) {
                _this.navCtrl.setRoot(ProductoPage);
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
    AgregarProductoPage.prototype.onChange = function (value) {
        console.log(value);
    };
    AgregarProductoPage.prototype.configuaraciones = function (myEvent) {
        var popover = this.popoverCtrl.create(ConfiguaracionesPage);
        popover.present({
            ev: myEvent
        });
    };
    AgregarProductoPage = __decorate([
        Component({
            selector: 'page-agregar-producto',
            templateUrl: 'agregar-producto.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ProductoService,
            AlertController,
            PopoverController])
    ], AgregarProductoPage);
    return AgregarProductoPage;
}());
export { AgregarProductoPage };
//# sourceMappingURL=agregar-producto.js.map