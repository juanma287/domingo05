import { Component } from '@angular/core';
import { NavController,LoadingController, ToastController, NavParams,AlertController, PopoverController} from 'ionic-angular';
import { Producto } from '../../../model/producto/producto.model';
import { ProductoService } from '../../../services/producto.service';
import { ProductoPage} from "../producto/producto";
import {ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";

@Component({
  selector: 'page-agregar-producto',
  templateUrl: 'agregar-producto.html',
})
export class AgregarProductoPage {

  producto: Producto = {
    nombre: '',
    precio: 0,
    unidad: '',
    visible: true
   };


  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private productoService: ProductoService,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public loading: LoadingController,
    public toastCtrl: ToastController

  	) {
  }


  agregar(producto: Producto) {
          // show message
      let toast = this.toastCtrl.create({
        message: 'Producto agregado!',
        duration: 1500,
        position: 'bottom',
        cssClass: "yourCssClassName",
      });

     var estadoConexion = this.productoService.estadoConex;
     if(estadoConexion)
     {
        let loader = this.loading.create({  content: 'Pocesando…',  });
        loader.present().then(() => {
          this.productoService.agregar(producto).then(ref => { 
                   
                   loader.dismiss();
                   toast.present();  
                   this.navCtrl.pop();
                })        
             })     

     }
     else
     {
         const alert = this.alertCtrl.create({
          title: 'Error: sin conexión',
          subTitle: 'Para realizar la operación conéctese y vuelva a intentarlo',
          buttons: ['OK']
        });
        alert.present();
     }  
  }

  onChange(value) {
  console.log(value);

  }

 
  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }


}
