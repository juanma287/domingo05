import { Component} from '@angular/core';
import { NavController, LoadingController, PopoverController, AlertController,ToastController } from 'ionic-angular';;
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { Compra } from '../../../model/compra/compra.model';
import { CuentaService } from '../../../services/cuenta.service';
import { AnotacionesService } from '../../../services/anotaciones.service';
import { Observable } from 'rxjs/Observable';
import { ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { VerAnotacionesCuentaPage } from "../../gestion-anotaciones/ver-anotaciones-cuenta/ver-anotaciones-cuenta";
import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'page-borrar-anotaciones',
  templateUrl: 'borrar-anotaciones.html',
})
export class BorrarAnotacionesPage {

  listaCuentas$: Observable<Cuenta[]>
  listaCompras$: Observable<Compra[]>
  SubscriptionCuenta: Subscription;
  fechaParaHTML:string;
  pipe = new DatePipe('es'); 
  fecha_de_borrado_number : any;
  fecha_de_borrado:any;


  constructor(
   	 public navCtrl: NavController,
  	 private cuentaService: CuentaService,
  	 public loading: LoadingController,
     public popoverCtrl: PopoverController,
     private anotacionesService: AnotacionesService,
     public alertCtrl: AlertController,
     public toastCtrl: ToastController
  	 ) 
	  {
         this.fechaParaHTML = new Date().toISOString();
         this.fecha_de_borrado = this.pipe.transform(this.fechaParaHTML ,'dd/MM/yyyy');
         this.fecha_de_borrado_number = new Date(this.fechaParaHTML).getTime();
	  }

  ionViewDidLoad() {
  }

  cambiarFecha()  {
    this.fecha_de_borrado = this.pipe.transform(this.fechaParaHTML ,'dd/MM/yyyy');
    this.fecha_de_borrado_number = new Date(this.fechaParaHTML).getTime();
  }


  borrar()
  {

   let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Esta seguro que desea borrar aquellas anotaciones que sean anteriores a la fecha seleccionada?',
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
                  message: 'Operacion realizada con éxito!',
                  duration: 2500,
                  position: 'bottom',
                  cssClass: "yourCssClassName",
                });

               let loader = this.loading.create({  content: 'Pocesando…',  });
               loader.present().then(() => {

             // Treamos las cuentas del comercio
            this.listaCuentas$ = this.cuentaService.getListaOrderBy('fecha_ultima_compra_number')
               .snapshotChanges().map(changes => {
                 return changes.map (c => ({
                 key: c.payload.key, ...c.payload.val()
              }));
            });
            
            this.SubscriptionCuenta = this.listaCuentas$.pipe(take(1)).subscribe((result: any[]) => {  
                  let length = result.length;
                  let aux = 0;
                  for (var i = 0; i < length; ++i) {
                    // Si nunca pago, directamente no traemos sus anotaciones
                    if(result[i].fecha_ultimo_pago_number != 0) 
                 {
                  this.ejecutarBorrado(result[i].key);
                 }  
              }                 
            });

              // finalizo loader
              loader.dismiss();
              toast.present();  
              this.navCtrl.pop();
                 
           });
         }
       }
     ]
    });
    alert.present();    




  }

  ejecutarBorrado(key_cuenta)
  {
   this.listaCompras$ = this.anotacionesService.getComprasFechaDeCorte(key_cuenta, this.fecha_de_borrado_number*-1)
            .snapshotChanges().map(changes => {
                     return changes.map (c => ({
                     key: c.payload.key, ...c.payload.val()
                 }));
            });     

   this.listaCompras$.pipe(take(1)).subscribe((result: any[]) => {    
                let length = result.length;
                for (var i = 0; i < length; ++i) 
                {
                 if(result[i].estado == "intacta" && result[i].tipo == "anota")
                 {
                   // se trata de una anotacion aun no solada por lo que no la borramos
                 }
                 else if(result[i].estado != "parcialmente saldada")
                 {               
                  console.log(key_cuenta);
                   this.anotacionesService.borrarCompra(key_cuenta, result[i].key)                                 
            
                 }
                }

               });  
  }


  // quitamos la suscripcion al observable
  ngOnDestroy() {
      if(this.SubscriptionCuenta && !this.SubscriptionCuenta.closed)
           this.SubscriptionCuenta.unsubscribe();            
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
