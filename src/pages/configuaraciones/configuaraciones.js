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
import { ViewController, NavController } from "ionic-angular";
import { AuthService } from '../../services/auth.service';
import { LoginPage } from "../../pages/login/login";
var ConfiguaracionesPage = /** @class */ (function () {
    function ConfiguaracionesPage(viewCtrl, auth, nav) {
        this.viewCtrl = viewCtrl;
        this.auth = auth;
        this.nav = nav;
    }
    ConfiguaracionesPage.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    ConfiguaracionesPage.prototype.cerrarSesion = function () {
        this.auth.signOut();
        this.nav.setRoot(LoginPage);
    };
    ConfiguaracionesPage.prototype.configuracion = function () {
    };
    ConfiguaracionesPage.prototype.politicaPrivacidad = function () { };
    ConfiguaracionesPage = __decorate([
        Component({
            selector: 'page-configuaraciones',
            templateUrl: 'configuaraciones.html'
        }),
        __metadata("design:paramtypes", [ViewController, AuthService, NavController])
    ], ConfiguaracionesPage);
    return ConfiguaracionesPage;
}());
export { ConfiguaracionesPage };
//# sourceMappingURL=configuaraciones.js.map