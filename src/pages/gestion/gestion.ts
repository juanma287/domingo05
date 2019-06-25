import { Component } from '@angular/core';
import { NavController,PopoverController, NavParams } from 'ionic-angular';
import {CuentaPage} from "../gestion-cuentas/cuenta/cuenta";
import {ProductoPage} from "../gestion-productos/producto/producto";
import { BorrarAnotacionesPage } from "../gestion-anotaciones/borrar-anotaciones/borrar-anotaciones";
import {ConfiguaracionesPage} from "../configuaraciones/configuaraciones";

@Component({
  selector: 'gestion',
  templateUrl: 'gestion.html',
})
export class GestionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }



  gestionMenuComercio(home)
  {
      switch(home) { 

      case 'borrar_anotaciones': { 
          // mostramos el home de cuenta
          this.navCtrl.push(BorrarAnotacionesPage); 
          break; 
          
       } 
      case 'cuenta': { 
          // mostramos el home de clientes
          this.navCtrl.push(CuentaPage); 
          break; 
       } 
       case 'producto': {
          // mostramos el home de productos
          this.navCtrl.push(ProductoPage);
          break;    
       } 
      }
  }

    configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }


 }


