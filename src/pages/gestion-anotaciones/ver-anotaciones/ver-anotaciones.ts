import { Component} from '@angular/core';
import { NavController, LoadingController, PopoverController} from 'ionic-angular';;
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { CuentaService } from '../../../services/cuenta.service'
import { Anotar } from "../../gestion-anotaciones/anotar/anotar";
//import { EditarCuentaPage } from "../editar-cuenta/editar-cuenta";
import { Observable } from 'rxjs/Observable';
import { HomeComercioPage } from "../../home-comercio/home-comercio";
import { ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { VerAnotacionesCuentaPage } from "../../gestion-anotaciones/ver-anotaciones-cuenta/ver-anotaciones-cuenta";



@Component({
  selector: 'page-ver-anotaciones',
  templateUrl: 'ver-anotaciones.html',
})
export class VerAnotacionesPage {

  listaCuentas$: Observable<Cuenta[]>
  items$: Observable<Cuenta[]>
  total: number=0


  constructor(
   	 public navCtrl: NavController,
  	 private cuentaService: CuentaService,
  	 public loading: LoadingController,
     public popoverCtrl: PopoverController,
  	 ) 
	  {    
	  }

  ionViewDidLoad() {

   let loader = this.loading.create({  content: 'Pocesando…',  });
   loader.present().then(() => {

    this.listaCuentas$ = this.cuentaService.getListaOrderBy('fecha_ultima_compra_number')
	     .snapshotChanges().map(changes => {
         return changes.map (c => ({
         key: c.payload.key, ...c.payload.val()
      }));
    });
     
     this.inicializarItems();
    
     // calculamos el total de las deudas
     this.listaCuentas$.subscribe(result => {     
              let length = result.length;
              let aux = 0;
              for (var i = 0; i < length; ++i) {
                aux = aux + result[i].total_deuda;
              }
             this.total = this.truncateDecimals(aux, 2);
        });
      
   
	  // finalizo loader
    loader.dismiss()                     
    });

  }

  inicializarItems()
  {
   this.items$ = this.listaCuentas$;
  }


  truncateDecimals (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };


  getItems(ev: any)
  {
    // primero inicializamos los items por si hubo algun cambio
    this.inicializarItems();

    // capturamos el evento
    let val = ev.target.value;
 
    if(val && val.trim != '')
    {
     this.items$ = this.items$
     .map( arr =>
           arr.filter( r => r.nombre.toLowerCase().includes(val.toLowerCase()))
      )
     
     }
  
   }

  // al seleccinar una cuenta para ver su saldo abrimos el detalle de la cuenta
  seleccinar(cuenta: Cuenta)
  {
  	 this.navCtrl.push(VerAnotacionesCuentaPage, {cuenta: cuenta});
  }


  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }

}
