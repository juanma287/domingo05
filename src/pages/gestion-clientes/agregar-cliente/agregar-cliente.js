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
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ComercioService } from '../../../services/comercio.service';
import { ClientePage } from "../cliente/cliente";
var AgregarClientePage = /** @class */ (function () {
    function AgregarClientePage(navCtrl, navParams, comercioService, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.comercioService = comercioService;
        this.alertCtrl = alertCtrl;
        this.comercio = {
            id_duenio: '',
            calle: '',
            nombre: '',
            ciudad: '',
            clientes: '',
            productos: ''
        };
    }
    AgregarClientePage.prototype.agregarComercio = function (comercio) {
        var _this = this;
        var estadoConexion = this.comercioService.estadoConex;
        if (estadoConexion) {
            this.comercioService.agregarComercio(comercio).then(function (ref) {
                _this.navCtrl.setRoot(ClientePage);
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
    AgregarClientePage = __decorate([
        Component({
            selector: 'page-agregar-cliente',
            templateUrl: 'agregar-cliente.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ComercioService,
            AlertController])
    ], AgregarClientePage);
    return AgregarClientePage;
}());
export { AgregarClientePage };
//# sourceMappingURL=agregar-cliente.js.map