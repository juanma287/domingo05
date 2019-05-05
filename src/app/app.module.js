var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from "@angular/core";
import { IonicApp, IonicModule } from "ionic-angular";
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { ActivityService } from "../services/activity-service";
import { TripService } from "../services/trip-service";
import { MyApp } from "./app.component";
import { SettingsPage } from "../pages/settings/settings";
import { CheckoutTripPage } from "../pages/checkout-trip/checkout-trip";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
// gestion de comercios
import { ComercioPage } from "../pages/gestion-comercio/comercio/comercio";
import { AgregarComercioPage } from "../pages/gestion-comercio/agregar-comercio/agregar-comercio";
import { EditarComercioPage } from "../pages/gestion-comercio/editar-comercio/editar-comercio";
// gestion de productos
import { ProductoPage } from "../pages/gestion-productos/producto/producto";
import { AgregarProductoPage } from "../pages/gestion-productos/agregar-producto/agregar-producto";
import { EditarProductoPage } from "../pages/gestion-productos/editar-producto/editar-producto";
// gestion de cuentas
import { CuentaPage } from "../pages/gestion-cuentas/cuenta/cuenta";
import { AgregarCuentaPage } from "../pages/gestion-cuentas/agregar-cuenta/agregar-cuenta";
import { EditarCuentaPage } from "../pages/gestion-cuentas/editar-cuenta/editar-cuenta";
// gestion de clientes
import { ClientePage } from "../pages/gestion-clientes/cliente/cliente";
import { AgregarClientePage } from "../pages/gestion-clientes/agregar-cliente/agregar-cliente";
import { EditarClientePage } from "../pages/gestion-clientes/editar-cliente/editar-cliente";
import { HomeComercioPage } from "../pages/home-comercio/home-comercio";
import { AnotadorPage } from "../pages/gestion-anotaciones/anotador";
// buscador de cuentas del ANOTADOR
import { BuscarCuentaPage } from "../pages/gestion-anotaciones/buscar-cuenta/buscar-cuenta";
import { ConfiguaracionesPage } from "../pages/configuaraciones/configuaraciones";
import { RegisterPage } from "../pages/register/register";
import { SearchLocationPage } from "../pages/search-location/search-location";
import { TripDetailPage } from "../pages/trip-detail/trip-detail";
import { TripsPage } from "../pages/trips/trips";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import { ComercioService } from '../services/comercio.service';
import { ProductoService } from '../services/producto.service';
import { CuentaService } from '../services/cuenta.service';
import { DatePipe } from '@angular/common';
export var firebaseConfig = {
    apiKey: "AIzaSyD8Wj--z7_Xt05oaqZ6PMF29Gh_m4z77Lk",
    authDomain: "libreta-electronica-4736d.firebaseapp.com",
    databaseURL: "https://libreta-electronica-4736d.firebaseio.com",
    projectId: "libreta-electronica-4736d",
    storageBucket: "libreta-electronica-4736d.appspot.com",
    messagingSenderId: "891119836846"
};
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                SettingsPage,
                CheckoutTripPage,
                HomePage,
                HomeComercioPage,
                AnotadorPage,
                LoginPage,
                ComercioPage,
                AgregarComercioPage,
                EditarComercioPage,
                ProductoPage,
                AgregarProductoPage,
                EditarProductoPage,
                CuentaPage,
                AgregarCuentaPage,
                EditarCuentaPage,
                ClientePage,
                AgregarClientePage,
                EditarClientePage,
                BuscarCuentaPage,
                ConfiguaracionesPage,
                RegisterPage,
                SearchLocationPage,
                TripDetailPage,
                TripsPage
            ],
            imports: [
                BrowserModule,
                AngularFireModule.initializeApp(firebaseConfig, 'libreta-electronica'),
                AngularFireDatabaseModule,
                NgxErrorsModule,
                IonicModule.forRoot(MyApp, {
                    scrollPadding: false,
                    scrollAssist: true,
                    autoFocusAssist: false
                }),
                IonicStorageModule.forRoot({
                    name: '__ionic3_start_theme',
                    driverOrder: ['indexeddb', 'sqlite', 'websql']
                })
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
                SettingsPage,
                CheckoutTripPage,
                HomePage,
                HomeComercioPage,
                AnotadorPage,
                LoginPage,
                ConfiguaracionesPage,
                RegisterPage,
                SearchLocationPage,
                TripDetailPage,
                TripsPage,
                ComercioPage,
                AgregarComercioPage,
                EditarComercioPage,
                CuentaPage,
                AgregarCuentaPage,
                EditarCuentaPage,
                ClientePage,
                AgregarClientePage,
                EditarClientePage,
                BuscarCuentaPage,
                ProductoPage,
                AgregarProductoPage,
                EditarProductoPage
            ],
            providers: [
                StatusBar,
                SplashScreen,
                Keyboard,
                ActivityService,
                TripService,
                AngularFireAuth,
                AuthService,
                ComercioService,
                ProductoService,
                CuentaService,
                DatePipe
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map