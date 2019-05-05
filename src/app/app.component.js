var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from "@angular/core";
import { Platform, Nav } from "ionic-angular";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';
import { HomePage } from "../pages/home/home";
import { HomeComercioPage } from "../pages/home-comercio/home-comercio";
import { LoginPage } from "../pages/login/login";
import { CuentaPage } from "../pages/gestion-cuentas/cuenta/cuenta";
import { ClientePage } from "../pages/gestion-clientes/cliente/cliente";
import { ProductoPage } from "../pages/gestion-productos/producto/producto";
import { BuscarCuentaPage } from "../pages/gestion-anotaciones/buscar-cuenta/buscar-cuenta";
import { AuthService } from '../services/auth.service';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, keyboard, auth, storage) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.keyboard = keyboard;
        this.auth = auth;
        this.storage = storage;
        this.rootPage = LoginPage;
        this.initializeApp();
        this.appMenuItems = [
            { title: 'Home', component: HomePage, icon: 'home' },
            { title: 'Home-comercio', component: HomeComercioPage, icon: 'home' },
            { title: 'Anotar', component: BuscarCuentaPage, icon: 'create' },
            { title: 'Gestionar cuentas', component: CuentaPage, icon: 'logo-buffer' },
            { title: 'Gestionar clientes vinculados', component: ClientePage, icon: 'contacts' },
            { title: 'Gestionar productos', component: ProductoPage, icon: 'cart' }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            //*** Control Splash Screen
            // this.splashScreen.show();
            // this.splashScreen.hide();
            //*** Control Status Bar
            _this.statusBar.styleDefault();
            _this.statusBar.overlaysWebView(false);
            //*** Control Keyboard
            _this.keyboard.disableScroll(true);
        });
        this.auth.afAuth.authState
            .subscribe(function (user) {
            if (user) {
                // Traemos el usuario almacenado en al base de datos 
                _this.auth.infoUsuarioBD()
                    .subscribe(function (usuarioBD) {
                    _this.usuario = usuarioBD;
                    _this.storage.set('usuario', _this.usuario); // alamecenamos info del usuario en localstorage
                    // verificamos si es cliente o trabaja en un comercio
                    if (_this.usuario.id_comercio != "") {
                        _this.rootPage = HomeComercioPage;
                        // this.auth.infoComercioBD(this.usuario.id_comercio)
                        // .subscribe(comercioBD => console.log(comercioBD))
                    }
                    else {
                        alert("cliente");
                        _this.rootPage = HomePage;
                    }
                });
            }
            else {
                _this.rootPage = LoginPage;
            }
        }, function () {
            _this.rootPage = LoginPage;
        });
    };
    MyApp.prototype.openPage = function (page) {
        this.nav.setRoot(page.component);
    };
    MyApp.prototype.logout = function () {
        this.auth.signOut();
        this.nav.setRoot(LoginPage);
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform,
            StatusBar,
            SplashScreen,
            Keyboard,
            AuthService,
            Storage])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map