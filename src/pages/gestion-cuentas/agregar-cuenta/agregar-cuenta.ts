import { Component } from '@angular/core';
import { NavController,LoadingController,ToastController, NavParams,AlertController, PopoverController} from 'ionic-angular';
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { CuentaService } from '../../../services/cuenta.service';
import { ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'page-agregar-cuenta',
  templateUrl: 'agregar-cuenta.html',
})
export class AgregarCuentaPage {


 public cuenta: Cuenta = {
    id_cliente:'',
    nombre:'',
    observacion:'',
    total_deuda: 0,  
    fecha_ultimo_pago: '',
    fecha_ultimo_pago_number: 0,
    fecha_ultima_compra: '',
    fecha_ultima_compra_number:0,
    fecha_alta: '',
    fecha_alta_number: 0,
    saldado_hasta_fecha: 0 
    };
 

    pipe = new DatePipe('es'); 
    hoy = new Date().getTime();

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private cuentaService: CuentaService,
    public alertCtrl: AlertController,
    public loading: LoadingController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController
  	) {

     this.cuenta.fecha_alta = this.pipe.transform(this.hoy ,'dd/MM/yyyy');

     // a la fecha tambien la guardamos como número para luego poder manipularla en los filtrados
     // se pone negativa para poder ordenar desendente con firebase
     this.cuenta.fecha_alta_number = this.hoy * -1;

  }


  agregar(cuenta: Cuenta) {
      // show message
      let toast = this.toastCtrl.create({
        message: 'Cuenta creada!',
        duration: 1500,
        position: 'bottom',
        cssClass: "yourCssClassName",
      });

     var estadoConexion = this.cuentaService.estadoConex;
     if(estadoConexion)
     {
        let loader = this.loading.create({  content: 'Pocesando…',  });
        loader.present().then(() => {
          this.cuentaService.agregar(cuenta).then(ref => { 

                      loader.dismiss();
                      toast.present();  
                      this.navCtrl.pop();                    
                                      
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
