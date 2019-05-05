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
import { NavController, NavParams } from 'ionic-angular';
import { ComercioService } from '../../../services/comercio.service';
import { ClientePage } from "../cliente/cliente";
var EditarClientePage = /** @class */ (function () {
    function EditarClientePage(navCtrl, navParams, comercioService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.comercioService = comercioService;
        this.comercio = {
            key: '',
            id_duenio: '',
            calle: '',
            nombre: '',
            ciudad: '',
            clientes: '',
            productos: ''
        };
    }
    EditarClientePage.prototype.ionViewWillLoad = function () {
        this.comercio = this.navParams.get('comercio');
    };
    EditarClientePage.prototype.actualizarComercio = function (comercio) {
        var _this = this;
        this.comercioService.actualizarComercio(comercio).then(function () {
            _this.navCtrl.setRoot(ClientePage);
        });
    };
    EditarClientePage.prototype.eliminarComercio = function (comercio) {
        var _this = this;
        this.comercioService.eliminarComercio(comercio).then(function () {
            _this.navCtrl.setRoot(ClientePage);
        });
    };
    EditarClientePage = __decorate([
        Component({
            selector: 'page-editar-cliente',
            templateUrl: 'editar-cliente.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ComercioService])
    ], EditarClientePage);
    return EditarClientePage;
}());
export { EditarClientePage };
//# sourceMappingURL=editar-cliente.js.map