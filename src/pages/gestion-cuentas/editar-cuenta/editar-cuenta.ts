import { Component } from '@angular/core';
import { NavController,AlertController,LoadingController,ToastController, NavParams, PopoverController } from 'ionic-angular';
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { CuentaService } from '../../../services/cuenta.service';
import { CuentaPage} from "../cuenta/cuenta";
import {ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";


@Component({
  selector: 'page-editar-cuenta',
  templateUrl: 'editar-cuenta.html',
})
export class EditarCuentaPage {

  cuenta: Cuenta 

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private cuentaService: CuentaService,
    public loading: LoadingController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
    ) 
  {   
  }

  ionViewWillLoad() {
   this.cuenta = this.navParams.get('cuenta');
  }
 

  actualizar(cuenta: Cuenta) {
      // show message
      let toast = this.toastCtrl.create({
        message: 'Cuenta actualizada!',
        duration: 1500,
        position: 'bottom',
        cssClass: "yourCssClassName",
      });

    let loader = this.loading.create({  content: 'Pocesando…',  });
     loader.present().then(() => {

            this.cuentaService.actualizar(cuenta).then(() => {
            // acutalizamos tambien la info en cuenta-general
            this.cuentaService.actualizarCuentaGeneral(cuenta.key, cuenta.nombre).then(ref => {
             // finalizo loader
             loader.dismiss(); 
             toast.present();   
             this.navCtrl.pop();
            })           
          })                   
    });
  }
 
  eliminar(cuenta: Cuenta) {

   let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Esta seguro que desea elimiar la cuenta?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          handler: () => {
            // codigo si presiona cancelar
          }
        },
        {
          text: 'aceptar',
          handler: () => {
                         // show message
                let toast = this.toastCtrl.create({
                  message: 'Cuenta eliminada!',
                  duration: 1500,
                  position: 'bottom',
                  cssClass: "yourCssClassName",
                });

               let loader = this.loading.create({  content: 'Pocesando…',  });
               loader.present().then(() => {

                   this.cuentaService.eliminar(cuenta).then(() => {
                   this.cuentaService.eliminarCuentaGeneral(cuenta.key).then(ref => {
                       // finalizo loader
                       loader.dismiss();
                       toast.present();  
                       this.navCtrl.pop();
                    })           
                  })
               });
          }
        }
      ]
    });
    alert.present();    
    
  }


  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }
}