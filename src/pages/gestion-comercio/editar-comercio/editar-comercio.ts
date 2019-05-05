import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Comercio } from '../../../model/comercio/comercio.model';
import { ComercioService } from '../../../services/comercio.service';
import {ComercioPage} from "../comercio/comercio";



@Component({
  selector: 'page-editar-comercio',
  templateUrl: 'editar-comercio.html',
})
export class EditarComercioPage {

 comercio: Comercio = {
    key:'',
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
    private comercioService: ComercioService) 
  {   
  }

  ionViewWillLoad() {
   this.comercio = this.navParams.get('comercio');
  }
 
 
  actualizarComercio(comercio: Comercio) {
    this.comercioService.actualizarComercio(comercio).then(() => {
      this.navCtrl.push(ComercioPage);
    })
  }
 
  eliminarComercio(comercio: Comercio) {
    this.comercioService.eliminarComercio(comercio).then(() => {
      this.navCtrl.push(ComercioPage);
    })
  }
}