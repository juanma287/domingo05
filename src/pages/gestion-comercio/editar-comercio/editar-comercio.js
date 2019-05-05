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
import { ComercioPage } from "../comercio/comercio";
var EditarComercioPage = /** @class */ (function () {
    function EditarComercioPage(navCtrl, navParams, comercioService) {
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
    EditarComercioPage.prototype.ionViewWillLoad = function () {
        this.comercio = this.navParams.get('comercio');
    };
    EditarComercioPage.prototype.actualizarComercio = function (comercio) {
        var _this = this;
        this.comercioService.actualizarComercio(comercio).then(function () {
            _this.navCtrl.push(ComercioPage);
        });
    };
    EditarComercioPage.prototype.eliminarComercio = function (comercio) {
        var _this = this;
        this.comercioService.eliminarComercio(comercio).then(function () {
            _this.navCtrl.push(ComercioPage);
        });
    };
    EditarComercioPage = __decorate([
        Component({
            selector: 'page-editar-comercio',
            templateUrl: 'editar-comercio.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ComercioService])
    ], EditarComercioPage);
    return EditarComercioPage;
}());
export { EditarComercioPage };
//# sourceMappingURL=editar-comercio.js.map