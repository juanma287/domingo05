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
import { ProductoService } from '../../../services/producto.service';
import { ProductoPage } from "../producto/producto";
import { ConfiguaracionesPage } from "../../configuaraciones/configuaraciones";
var EditarProductoPage = /** @class */ (function () {
    function EditarProductoPage(navCtrl, navParams, productoService, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.productoService = productoService;
        this.popoverCtrl = popoverCtrl;
    }
    EditarProductoPage.prototype.ionViewWillLoad = function () {
        this.producto = this.navParams.get('producto');
    };
    EditarProductoPage.prototype.actualizar = function (producto) {
        var _this = this;
        this.productoService.actualizar(producto).then(function () {
            _this.navCtrl.setRoot(ProductoPage);
        });
    };
    EditarProductoPage.prototype.eliminar = function (producto) {
        var _this = this;
        this.productoService.eliminar(producto).then(function () {
            _this.navCtrl.setRoot(ProductoPage);
        });
    };
    EditarProductoPage.prototype.onChange = function (value) {
        console.log(value);
    };
    EditarProductoPage.prototype.configuaraciones = function (myEvent) {
        var popover = this.popoverCtrl.create(ConfiguaracionesPage);
        popover.present({
            ev: myEvent
        });
    };
    EditarProductoPage = __decorate([
        Component({
            selector: 'page-editar-producto',
            templateUrl: 'editar-producto.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ProductoService,
            PopoverController])
    ], EditarProductoPage);
    return EditarProductoPage;
}());
export { EditarProductoPage };
//# sourceMappingURL=editar-producto.js.map