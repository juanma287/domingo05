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
  precio_original: any
  msjError: string

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
     this.msjError = '';
  }

  ionViewWillLoad() {
   this.producto = this.navParams.get('producto');
   this.precio_original = this.producto.precio;

  }
 
 
  actualizar(producto: Producto) {


     if(this.producto.precio < 0)
     {
       this.msjError = "No puede ingresar valores negativos";
     }
     else if ( this.producto.precio.toString().length == 0)
     {
       this.msjError = "El precio no puede estar vacio";
     }
     else
     {
       this.msjError = '';
     }   


  if(this.msjError === '') // si no hay msj de error comenzamos a procesar
  {
            // show message
        let toast = this.toastCtrl.create({
          message: 'Producto actualizado!',
          duration: 2500,
          position: 'bottom',
          cssClass: "yourCssClassName",
        });

     
     // Si modifico el precio le preguntamos si desea que la acutalizacion sea retroactiva 
     if(this.precio_original != this.producto.precio)
     {
          let alert = this.alertCtrl.create({
          title: 'Consulta',
          message: '¿Desea que la actualización del precio sea retroactiva?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                  // codigo si presiona cancelar
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
            },
            {
              text: 'Si',
              handler: () => {

                  console.log("eligio retroactivo");
              }
            }
          ]
        });
        alert.present();    
     }
     else
     {
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

  }

         
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