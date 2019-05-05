import { Component, ViewChild } from "@angular/core";
import { Platform, Nav } from "ionic-angular";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import {Storage} from '@ionic/storage';

import { HomeComercioPage } from "../pages/home-comercio/home-comercio";
import { LoginPage } from "../pages/login/login";

import { CuentaPage } from "../pages/gestion-cuentas/cuenta/cuenta";
import { ClientePage } from "../pages/gestion-clientes/cliente/cliente";
import { ProductoPage } from "../pages/gestion-productos/producto/producto";

import { BuscarCuentaPage } from "../pages/gestion-anotaciones/buscar-cuenta/buscar-cuenta";
import { VerAnotacionesPage } from "../pages/gestion-anotaciones/ver-anotaciones/ver-anotaciones";


import { AuthService } from '../services/auth.service';
import { Usuario } from '../model/usuario/usuario.model';


export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  appMenuItems: Array<MenuItem>;
  usuario: Usuario;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public keyboard: Keyboard,
    private auth: AuthService,
    private storage: Storage, 
  ) {
    this.initializeApp();

    this.appMenuItems = [
      {title: 'Inicio', component: HomeComercioPage, icon: 'home'},
      {title: 'Anotador', component: BuscarCuentaPage, icon: 'create'},
      {title: 'Saldos', component: VerAnotacionesPage, icon: 'logo-usd'},
      {title: 'Gestionar cuentas', component: CuentaPage, icon: 'logo-buffer'},
      {title: 'Clientes Vinculados', component: ClientePage, icon: 'contacts'},
      {title: 'Gestionar productos', component: ProductoPage, icon: 'cart'}  
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.

      //*** Control Splash Screen
      // this.splashScreen.show();
      // this.splashScreen.hide();

      //*** Control Status Bar
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      //*** Control Keyboard
      this.keyboard.disableScroll(true);
    });

  


    this.auth.afAuth.authState
        .subscribe(
          user => {
            if (user)
             {
               // Traemos el usuario almacenado en al base de datos 
                this.auth.infoUsuarioBD()
                .subscribe(usuarioBD => 
                          {
                          this.usuario =  usuarioBD;
                          this.storage.set('usuario',this.usuario); // alamecenamos info del usuario en localstorage

                          // verificamos si es cliente o trabaja en un comercio
                          if(this.usuario.id_comercio != "") 
                            {
                              this.rootPage = HomeComercioPage;
                             // this.auth.infoComercioBD(this.usuario.id_comercio)
                             // .subscribe(comercioBD => console.log(comercioBD))
                            }
                          else
                           {
                              alert("cliente");
                              this.rootPage = HomeComercioPage;

                           }
                          

                          
                          }
                 );
               
             }
             else
             {
               this.rootPage = LoginPage;
             }
          },
          () =>
           {
            this.rootPage = LoginPage;
           }
        );


  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

}
