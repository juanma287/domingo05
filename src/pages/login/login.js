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
import { NavController, AlertController, ToastController, MenuController, LoadingController } from "ionic-angular";
import { AuthService } from '../../services/auth.service';
import { Storage } from '@ionic/storage';
import { HomePage } from "../home/home";
import { RegisterPage } from "../register/register";
import { ComercioPage } from "../gestion-comercio/comercio/comercio";
var LoginPage = /** @class */ (function () {
    function LoginPage(storage, nav, forgotCtrl, alertCtrl, menu, toastCtrl, loading, auth, fb) {
        this.storage = storage;
        this.nav = nav;
        this.forgotCtrl = forgotCtrl;
        this.alertCtrl = alertCtrl;
        this.menu = menu;
        this.toastCtrl = toastCtrl;
        this.loading = loading;
        this.auth = auth;
        this.menu.swipeEnable(false);
        this.loginForm = fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
    }
    // MÉTODOS
    // Si presiona crear nuevo usuario, lo re-dirigimos a dicha pagina
    LoginPage.prototype.register = function () {
        this.nav.setRoot(RegisterPage);
    };
    // luego lo borramos, lo tengo solo para probar  
    LoginPage.prototype.crud = function () {
        this.nav.setRoot(ComercioPage);
    };
    // login 
    LoginPage.prototype.login = function () {
        var _this = this;
        var data = this.loginForm.value;
        var credentials = {
            email: data.email,
            password: data.password
        };
        var loader = this.loading.create({ content: 'Pocesando, espere por favor…', });
        loader.present().then(function () {
            // AUTENTICACION
            _this.auth.signInWithEmail(credentials)
                .then(function () { return _this.nav.setRoot(HomePage); })
                .catch(function (error) { return _this.loginError = "Datos de ingreso incorrectos"; });
            // finalizo loader
            loader.dismiss();
        });
    };
    // Ingresar con Google
    LoginPage.prototype.loginWithGoogle = function () {
        var _this = this;
        this.auth.signInWithGoogle()
            .then(function () { return _this.nav.setRoot(HomePage); })
            .catch(function (error) { return console.log(error.message); });
    };
    // Ingresar con Facebook
    LoginPage.prototype.loginWithFacebook = function () {
        var _this = this;
        this.auth.signInWithFacebook()
            .then(function () { return _this.nav.setRoot(HomePage); })
            .catch(function (error) { return console.log(error.message); });
    };
    // Ingresar con Twitter
    LoginPage.prototype.loginWithTwitter = function () {
        var alert = this.alertCtrl.create({
            title: 'Ingreso Twitter',
            subTitle: 'El ingreso por medio de twitter aún no se encuentra habilidato.',
            buttons: ['OK']
        });
        alert.present();
    };
    // resetar pass
    LoginPage.prototype.forgotPass = function () {
        var _this = this;
        var forgot = this.forgotCtrl.create({
            title: '¿Olvidó la contraseña?',
            message: "Ingrese su dirección de correo y enviaremos un link para restablecer la contraseña.",
            inputs: [
                {
                    name: 'email',
                    placeholder: 'Email',
                    type: 'email'
                },
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: function (data) {
                    }
                },
                {
                    text: 'Enviar',
                    handler: function (data) {
                        // Enviamos  
                        _this.auth.resetPassword(data.email).then(function () {
                            _this.storage.get('emailEnviado').then(function (val) {
                                if (val) {
                                    var toast = _this.toastCtrl.create({
                                        message: 'El correo fue enviado exitosamente',
                                        duration: 3000,
                                        position: 'top',
                                        cssClass: 'dark-trans',
                                        closeButtonText: 'OK',
                                        showCloseButton: true
                                    });
                                    toast.present();
                                }
                                else {
                                    var alert_1 = _this.alertCtrl.create({
                                        title: 'Correo inválido',
                                        subTitle: 'Ingrese nuevamente su correo.',
                                        buttons: [
                                            {
                                                text: 'OK',
                                                handler: function (data) {
                                                    _this.forgotPass();
                                                }
                                            }
                                        ]
                                    });
                                    alert_1.present();
                                }
                            });
                        });
                    }
                }
            ]
        });
        forgot.present();
    };
    LoginPage = __decorate([
        Component({
            selector: 'page-login',
            templateUrl: 'login.html'
        }),
        __metadata("design:paramtypes", [Storage,
            NavController,
            AlertController,
            AlertController,
            MenuController,
            ToastController,
            LoadingController,
            AuthService,
            FormBuilder])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map