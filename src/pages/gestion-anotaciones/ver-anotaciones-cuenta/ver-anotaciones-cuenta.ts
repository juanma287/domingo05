import { Component} from '@angular/core';
import { NavController, AlertController, LoadingController, PopoverController, NavParams} from 'ionic-angular';;
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { Compra } from '../../../model/compra/compra.model';
import { AnotacionesService } from '../../../services/anotaciones.service'
import {ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { VerDetallePage } from "../../gestion-anotaciones/ver-detalle/ver-detalle";
import { Observable } from 'rxjs/Observable';



@Component({
  selector: 'page-ver-anotaciones-cuenta',
  templateUrl: 'ver-anotaciones-cuenta.html',
})
export class VerAnotacionesCuentaPage {
 

   // lista de compras que tiene el comercio y el producto elegido en un detalle
   listaCompras$: Observable<Compra[]>

   // cuenta en la que anotaremos 
   cuenta: Cuenta;
   valoresCuenta:any;
   key_cuenta:any;
   total_deuda: any;
   cantidad: any;


  constructor(
   	 public navCtrl: NavController,
     private anotacionesService: AnotacionesService,
  	 public loading: LoadingController,
     public alertCtrl: AlertController,
     public popoverCtrl: PopoverController,
     public navParams: NavParams
  	 ) 
	  {
     // leemos el parametro y cargamos los valores en la variable valoresCuenta
     this.cuenta = this.navParams.data;
     this.valoresCuenta = (<any>Object).values(this.cuenta);
     this.valoresCuenta = this.valoresCuenta['0'];
     this.key_cuenta = this.valoresCuenta.key
     this.total_deuda = this.valoresCuenta.total_deuda;

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
        this.listaCompras$.subscribe(result => {     
              this.cantidad = "CANTIDAD DE COMPRAS: "+ result.length +"";      
        });

     
       // finalizo loader
       loader.dismiss()                     
       });
  }


  // al seleccinar una comora mostramos el detalle de la misma
  verDetalle(compra: Compra)
  {
     this.navCtrl.push(VerDetallePage, {cuenta:this.cuenta, compra: compra});
  }
 

  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }

}
