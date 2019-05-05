import { Component} from '@angular/core';
import { NavController,LoadingController, ToastController, AlertController, PopoverController, NavParams} from 'ionic-angular';
import { Compra } from '../../../model/compra/compra.model';
import { Detalle } from '../../../model/detalle/detalle.model';
import { ConfiguaracionesPage } from "../../configuaraciones/configuaraciones";
import { AnotacionesService } from '../../../services/anotaciones.service'
import { HomeComercioPage } from "../../home-comercio/home-comercio";



@Component({
  selector: 'page-ver-detalle',
  templateUrl: 'ver-detalle.html',
})
export class VerDetallePage {
 

   // Compra  con su detalle
   compra: Compra;
   cuenta: any;
   detalle: any=[];
   valoresCompra:any;
   items: Array<any[]>;
 
  constructor(
   	 public navCtrl: NavController,
     public popoverCtrl: PopoverController,
     public navParams: NavParams,
     private anotacionesService: AnotacionesService,
     public alertCtrl: AlertController,
     public toastCtrl: ToastController,
     public loading: LoadingController
  	 ) 
	  {
     this.valoresCompra = (<any>Object).values(this.navParams.data);
     this.cuenta = this.valoresCompra['0'];
     this.compra = this.valoresCompra['1'];
     this.detalle = this.valoresCompra['1'].detalle; 
     this.items = Object.keys(this.detalle).map(i => this.detalle[i]);

	  }

  ionViewDidLoad() {
    
  }

  // Se anula la anotacion comppleta
  anular()
  {
      let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Esta seguro que desea anular el movimiento?',
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
            this.ejecutarAnulacion();
          }
        }
      ]
    });
    alert.present();     
  }

  ejecutarAnulacion()
  {
     var key_cuenta = this.cuenta.cuenta.key;
     var key_compra = this.compra.key;
     var total_deuda = this.cuenta.cuenta.total_deuda;
     var total_deuda_nuevo = 0;
     var total_compra = this.compra.total_compra;
     var tipo_compra = this.compra.tipo;
     var estado = this.compra.estado;
      
      // show message
     let toast = this.toastCtrl.create({
        message: 'Movimiento anulado!',
        duration: 2500,
        position: 'bottom',
        cssClass: "yourCssClassName",
      });
   
       if(tipo_compra == "anota")
        {
           total_deuda_nuevo = total_deuda - total_compra; 
        }
       else if(tipo_compra == "entrega")
        {
           total_deuda_nuevo = total_deuda + total_compra; 
        }

        var estadoConexion = this.anotacionesService.estadoConex;
        if(estadoConexion)
         {
           let loader = this.loading.create({  content: 'Pocesando…',  });
           loader.present().then(() => {
        
                 this.anotacionesService.anularCompra(key_cuenta,key_compra).then(ref => {
                 
                 // Luego de anular la compra acutalizamos la cuenta 
                 this.anotacionesService.actualizarCuentaCompraAnulada(key_cuenta, total_deuda_nuevo);
                 this.anotacionesService.actualizarCuentaGeneralCompraAnulada(key_cuenta, total_deuda_nuevo);
            
                // finalizo loader
                 loader.dismiss(); 
                 toast.present();   
                 this.navCtrl.pop().then(ref => {
                       this.navCtrl.setRoot(HomeComercioPage);
                 })
             
              })
           });       
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

  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }

}
