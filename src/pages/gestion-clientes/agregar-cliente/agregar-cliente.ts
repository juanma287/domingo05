import { Component } from '@angular/core';
import { NavController, NavParams,AlertController} from 'ionic-angular';
import { Comercio } from '../../../model/comercio/comercio.model';
import { ComercioService } from '../../../services/comercio.service';
import { ClientePage} from "../cliente/cliente";

@Component({
  selector: 'page-agregar-cliente',
  templateUrl: 'agregar-cliente.html',
})
export class AgregarClientePage {

  comercio: Comercio = {
    id_duenio:'',
    calle:'',
    nombre: '',
    ciudad: '',
    clientes: '',
    productos: ''
   };


  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private comercioService: ComercioService,
    public alertCtrl: AlertController
  	) {
  }


  agregarComercio(comercio: Comercio) {
     var estadoConexion = this.comercioService.estadoConex;
     if(estadoConexion)
     {
          this.comercioService.agregarComercio(comercio).then(ref => { 
                  this.navCtrl.setRoot(ClientePage);
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



}
