import { Component } from '@angular/core';
import { NavController, LoadingController, PopoverController} from 'ionic-angular';
import { ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { Producto } from '../../../model/producto/producto.model';
import { ProductoService } from '../../../services/producto.service';
import { AgregarProductoPage } from "../agregar-producto/agregar-producto";
import { EditarProductoPage } from "../editar-producto/editar-producto";
import { Observable } from 'rxjs/Observable';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'page-producto',
  templateUrl: 'producto.html',
})
export class ProductoPage {

  listaProductos$: Observable<Producto[]>
  cantidad: string 
  listadeProductosArray:any;

  constructor(
   	 public navCtrl: NavController,
  	 private productoService: ProductoService,
  	 public loading: LoadingController,
     public popoverCtrl: PopoverController,
     private storage: Storage
  	 ) 
	  {
	  }

  ionViewDidLoad() {
   let loader = this.loading.create({  content: 'Pocesando…',  });
   loader.present().then(() => {

      this.listaProductos$ = this.productoService.getListaCompleta()
  	     .snapshotChanges().map(changes => {
           return changes.map (c => ({
           key: c.payload.key, ...c.payload.val()
        }));
      });

      // calculamos la cantidad de productos
      this.listaProductos$.subscribe(result => {     
               this.listadeProductosArray = result; 
               this.storage.set('productos', this.listadeProductosArray);
               //console.log(this.listadeProductosArray);      
               this.cantidad = "CANTIDAD DE PRODUCTOS: "+ result.length +"";      
        });


	  // finalizo loader
    loader.dismiss()                     
    });
  }

  agregar()
  {
  	 this.navCtrl.push(AgregarProductoPage);

  }

   editar(producto: Producto)
  {
  	 this.navCtrl.push(EditarProductoPage, {producto: producto});
  }


  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }
}


