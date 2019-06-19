import { Component} from '@angular/core';
import { NavController, LoadingController, PopoverController} from 'ionic-angular';;
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { CuentaService } from '../../../services/cuenta.service'
import { Observable } from 'rxjs/Observable';
import { ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { VerAnotacionesCuentaPage } from "../../gestion-anotaciones/ver-anotaciones-cuenta/ver-anotaciones-cuenta";
import { DatePipe } from '@angular/common';



@Component({
  selector: 'page-borrar-anotaciones',
  templateUrl: 'borrar-anotaciones.html',
})
export class BorrarAnotacionesPage {

  fechaParaHTML:string;
  pipe = new DatePipe('es'); 
  fecha_compra_number : any;
  fecha_compra:any;

  constructor(
   	 public navCtrl: NavController,
  	 private cuentaService: CuentaService,
  	 public loading: LoadingController,
     public popoverCtrl: PopoverController,
  	 ) 
	  {
         this.fechaParaHTML = new Date().toISOString();
         this.fecha_compra = this.pipe.transform(this.fechaParaHTML ,'dd/MM/yyyy');
         this.fecha_compra_number = new Date(this.fechaParaHTML).getTime();
	  }

  ionViewDidLoad() {
  }


  cambiarFecha()  {
    this.fecha_compra = this.pipe.transform(this.fechaParaHTML ,'dd/MM/yyyy');
    this.fecha_compra_number = new Date(this.fechaParaHTML).getTime();
  }

  volver() {
     this.navCtrl.pop();
  }

  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }

}
