import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';;
import { Comercio } from '../../../model/comercio/comercio.model';
import { ComercioService } from '../../../services/comercio.service';
import { AgregarClientePage } from "../agregar-cliente/agregar-cliente";
import { EditarClientePage } from "../editar-cliente/editar-cliente";
import {Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-cliente',
  templateUrl: 'cliente.html',
})
export class ClientePage {

  listaComercios$: Observable<Comercio[]>

  constructor(
   	 public navCtrl: NavController,
  	 private comercioService: ComercioService,
  	 public loading: LoadingController,
  	 ) 
	  {
	  }

  ionViewDidLoad() {
   let loader = this.loading.create({  content: 'Pocesando…',  });
   loader.present().then(() => {

    this.listaComercios$ = this.comercioService.getListaComercios()
	     .snapshotChanges().map(changes => {
         return changes.map (c => ({
         key: c.payload.key, ...c.payload.val()
      }));
    });
	
	   // finalizo loader
    loader.dismiss()                     
    });
  }

  agregarComercio()
  {
  	 this.navCtrl.push(AgregarClientePage);
  }

   editarComercio(comercio: Comercio)
  {

  	 this.navCtrl.push(EditarClientePage, {comercio: comercio});
  }
}
