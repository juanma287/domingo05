import { Component} from '@angular/core';
import { NavController, LoadingController, PopoverController} from 'ionic-angular';;
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { CuentaGeneral } from '../../../model/cuenta-general/cuenta-general.model';
import { CuentaService } from '../../../services/cuenta.service'
import { ComercioService } from '../../../services/comercio.service';
import { AgregarCuentaPage } from "../../gestion-cuentas/agregar-cuenta/agregar-cuenta";
import { Anotar } from "../../gestion-anotaciones/anotar/anotar";
//import { EditarCuentaPage } from "../editar-cuenta/editar-cuenta";
import { Observable } from 'rxjs/Observable';
import { HomeComercioPage } from "../../home-comercio/home-comercio";
import {ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";



@Component({
  selector: 'page-buscar-cuenta',
  templateUrl: 'buscar-cuenta.html',
})
export class BuscarCuentaPage {

  listaCuentasGenerales$: Observable<CuentaGeneral[]>
  listaCuentas$: Observable<Cuenta[]>
  cantidad: string 
  items$: Observable<Cuenta[]>

  constructor(
   	 public navCtrl: NavController,
  	 private cuentaService: CuentaService,
  	 public loading: LoadingController,
     public popoverCtrl: PopoverController
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
    
       /**
       this.listaCuentas$.subscribe(result => {     
              this.cantidad = "Cantidad de cuentas registradas: "+ result.length +"";      
        });
       */
   
	  // finalizo loader
    loader.dismiss()                     
    });

  }

  inicializarItems()
  {
   this.items$ = this.listaCuentas$;
  }
  
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

  agregar()
  {
  	 this.navCtrl.push(AgregarCuentaPage);
  }

  // al seleccinar una cuenta para anotar abrimos la ventana para anotaciones
  seleccinar(cuenta: Cuenta)
  {
  	 this.navCtrl.push(Anotar, {cuenta: cuenta});
  }


  volverHome()
  {
     this.navCtrl.push(HomeComercioPage);
  }

  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }

}
