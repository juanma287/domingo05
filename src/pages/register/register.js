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
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, AlertController, LoadingController } from "ionic-angular";
import { AuthService } from '../../services/auth.service';
import { LoginPage } from "../login/login";
import { HomePage } from "../home/home";
var RegisterPage = /** @class */ (function () {
    function RegisterPage(navCtrl, alertCtrl, loading, fb, auth) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.loading = loading;
        this.auth = auth;
        this.form = fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }
    // register and go to home page
    RegisterPage.prototype.register = function () {
        var _this = this;
        var data = this.form.value;
        var credentials = {
            email: data.email,
            password: data.password
        };
        var loader = this.loading.create({ content: 'Pocesando, espere por favor…', });
        loader.present().then(function () {
            // REGISTRO
            _this.auth.signUp(credentials)
                .then(function () { return _this.navCtrl.setRoot(HomePage); })
                .catch(function (error) { return _this.erroresRegistro = "Datos de ingreso incorrectos"; });
            // finalizo loader
            loader.dismiss();
        });
    };
    // Ingresar con Google
    RegisterPage.prototype.registerWithGoogle = function () {
        var _this = this;
        this.auth.signInWithGoogle()
            .then(function () { return _this.navCtrl.setRoot(HomePage); })
            .catch(function (error) { return console.log(error.message); });
    };
    // Ingresar con Facebook
    RegisterPage.prototype.registerWithFacebook = function () {
        var _this = this;
        this.auth.signInWithFacebook()
            .then(function () { return _this.navCtrl.setRoot(HomePage); })
            .catch(function (error) { return console.log(error.message); });
    };
    // Ingresar con Twitter
    RegisterPage.prototype.registerWithTwitter = function () {
        var alert = this.alertCtrl.create({
            title: 'Registro Twitter',
            subTitle: 'El registro por medio de twitter aún no se encuentra habilidato.',
            buttons: ['OK']
        });
        alert.present();
    };
    // vamos al login 
    RegisterPage.prototype.login = function () {
        this.navCtrl.setRoot(LoginPage);
    };
    RegisterPage = __decorate([
        Component({
            selector: 'page-register',
            templateUrl: 'register.html'
        }),
        __metadata("design:paramtypes", [NavController,
            AlertController,
            LoadingController,
            FormBuilder,
            AuthService])
    ], RegisterPage);
    return RegisterPage;
}());
export { RegisterPage };
//# sourceMappingURL=register.js.map