import { Component } from '@angular/core';
import { NavController,AlertController, NavParams,LoadingController, ToastController, PopoverController} from 'ionic-angular';
import { Producto } from '../../../model/producto/producto.model';
import { ProductoService } from '../../../services/producto.service';
import { ProductoPage } from "../producto/producto";
import {ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";


@Component({
  selector: 'page-editar-producto',
  templateUrl: 'editar-producto.html',
})
export class EditarProductoPage {

  producto: Producto 
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private productoService: ProductoService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public loading: LoadingController,
    public toastCtrl: ToastController
    ) 
  {   
  }

  ionViewWillLoad() {
   this.producto = this.navParams.get('producto');
  }
 
 
  actualizar(producto: Producto) {
          // show message
      let toast = this.toastCtrl.create({
        message: 'Producto actualizado!',
        duration: 1500,
        position: 'bottom',
        cssClass: "yourCssClassName",
      });

     let loader = this.loading.create({  content: 'Pocesando…',  });
        loader.present().then(() => {
        this.productoService.actualizar(producto).then(() => {
              // finalizo loader
             loader.dismiss(); 
             toast.present();   
             this.navCtrl.pop();
        })
      });
         
  }
 
  eliminar(producto: Producto) {

      let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Esta seguro que desea eliminar el producto?',
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
                  message: 'Producto eliminado!',
                  duration: 1500,
                  position: 'bottom',
                  cssClass: "yourCssClassName",
                });

               let loader = this.loading.create({  content: 'Pocesando…',  });
                     loader.present().then(() => {
                     this.productoService.eliminar(producto).then(() => {
                      // finalizo loader
                       loader.dismiss(); 
                       toast.present();   
                       this.navCtrl.pop();
                  })
                });
          }
        }
      ]
    });
    alert.present();    
  }


  onChange(value) {
 // console.log(value);

  }
  
  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }
}