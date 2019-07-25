import { Component} from '@angular/core';
import { NavController, AlertController, LoadingController, PopoverController, NavParams} from 'ionic-angular';;
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { Compra } from '../../../model/compra/compra.model';
import { AnotacionesService } from '../../../services/anotaciones.service'
import {ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { VerDetallePage } from "../../gestion-anotaciones/ver-detalle/ver-detalle";
import { Observable } from 'rxjs/Observable';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'page-ver-anotaciones-cuenta',
  templateUrl: 'ver-anotaciones-cuenta.html',
})
export class VerAnotacionesCuentaPage {
 

   // lista de compras de un cliente
   listaCompras$: Observable<Compra[]>
   SubscriptionCompra: Subscription;

   cuenta: Cuenta;
   valoresCuenta:any;
   key_cuenta:any;
   total_deuda: any;
   cantidad: any;

    listadeComprasArray: any;
    pipe = new DatePipe('es'); 
    fecha: string;
    fecha_formateda: string;

  constructor(
   	 public navCtrl: NavController,
     private anotacionesService: AnotacionesService,
  	 public loading: LoadingController,
     public alertCtrl: AlertController,
     public popoverCtrl: PopoverController,
     public navParams: NavParams,
     private socialSharing: SocialSharing

  	 ) 
	  {
     // leemos el parametro y cargamos los valores en la variable valoresCuenta
     this.cuenta = this.navParams.data;
     this.valoresCuenta = (<any>Object).values(this.cuenta);
     this.valoresCuenta = this.valoresCuenta['0'];
     this.key_cuenta = this.valoresCuenta.key
     this.total_deuda = this.valoresCuenta.total_deuda;

    this.fecha = new Date().toISOString();
    this.fecha_formateda = this.pipe.transform(this.fecha ,'dd/MM/yyyy');

	  }

  ionViewDidLoad() {

       // traemos los productos del comercio
       let loader = this.loading.create({  content: 'Pocesando…',  });
       loader.present().then(() => {

       this.listaCompras$ = this.anotacionesService.getCompras(this.key_cuenta)
         .snapshotChanges().map(changes => {
           return changes.map (c => ({
           key: c.payload.key, ...c.payload.val()
         }));
       });    
       // calculamos la cantidad de compras
        this.SubscriptionCompra = this.listaCompras$.subscribe(result => { 
              this.listadeComprasArray = result; 
              this.cantidad = "CANTIDAD DE MOVIMIENTOS: "+ result.length +"";      
        });

     
       // finalizo loader
       loader.dismiss()                     
       });
  }

  // quitamos la suscripcion al observable
  ngOnDestroy() {
      this.SubscriptionCompra.unsubscribe();
  }

  // al seleccinar una comora mostramos el detalle de la misma
  verDetalle(compra: Compra)
  {
     this.navCtrl.push(VerDetallePage, {cuenta:this.cuenta, compra: compra});
  }
 

  compartir()
  {
      let msj = this.armarMsj();
      //console.log(msj);
      this.socialSharing.share(msj, null, null, null).then(() => {
      //  console.log("exito");
      }).catch(() => {
       // console.log("fracaso");
      });

  }

  armarMsj()
  {
     var msg = "Estimado Cliente: " ;
     msg += this.valoresCuenta.nombre;
     msg += "\nEl total anotado al: " ;
     msg += this.fecha_formateda;
     msg += "\nEs de: $";
     msg += this.total_deuda;
     
     msg += "\n\nMovimientos\n";
     msg += "-----------------------------";
     msg += "\n";
    
     let length = this.listadeComprasArray.length;
     for (var i = 0; i < length; ++i) {
         if(this.listadeComprasArray[i].estado != "anulada")
         {
           msg += this.listadeComprasArray[i].fecha_compra;
           msg += "\n";

            let detalle = Object.keys(this.listadeComprasArray[i].detalle).map(j => this.listadeComprasArray[i].detalle[j]);
            let detalleLength = detalle.length;
            for (var z = 0; z < detalleLength; ++z) {
              if(detalle[z].unidad !="entrega" && detalle[z].unidad !="actualiza")
              {
                 msg += detalle[z].cantidad;
                 if(detalle[z].unidad == "unidad")
                 {
                   msg += "u";
                 }
                 else
                 {
                   msg += detalle[z].unidad;
                 }
                 msg += "  ";
                 msg += detalle[z].nombre_producto;
                 msg += "  $";
                 msg += detalle[z].total_detalle;          
                 msg += "\n";
              }
              else if(detalle[z].unidad == "entrega")
              {
                 msg += "Entrega   "
                 msg += "  - $";
                 msg += detalle[z].total_detalle;          
                 msg += "\n";
              }
               else if(detalle[z].unidad == "actualiza")
              {
                 msg += "Actualización   "
                 msg += "    $";
                 msg += detalle[z].total_detalle;          
                 msg += "\n";
              }    
                
            }

           msg += "-----------------------------";
           msg += "\n";
         }
  
     }

     return msg.concat("\nEnviado desde la aplicación :: Libreta Electrónica");
  }

  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }

}
