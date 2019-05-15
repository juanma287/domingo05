import { Component } from '@angular/core';
import { NavController, LoadingController, PopoverController} from 'ionic-angular';
import { HomeComercioPage } from "../../home-comercio/home-comercio";
import { ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { Producto } from '../../../model/producto/producto.model';
import { ProductoService } from '../../../services/producto.service';
import { AgregarProductoPage } from "../agregar-producto/agregar-producto";
import { EditarProductoPage } from "../editar-producto/editar-producto";
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-producto',
  templateUrl: 'producto.html',
})
export class ProductoPage {

  listaProductos$: Observable<Producto[]>
  cantidad: string 

  constructor(
   	 public navCtrl: NavController,
  	 private productoService: ProductoService,
  	 public loading: LoadingController,
     public popoverCtrl: PopoverController,
  	 ) 
	  {
	  }

  ionViewDidLoad() {
   let loader = this.loading.create({  content: 'Pocesando…',  });
   loader.present().then(() => {

      this.listaProductos$ = this.productoService.getListaVisible()
  	     .snapshotChanges().map(changes => {
           return changes.map (c => ({
           key: c.payload.key, ...c.payload.val()
        }));
      });

      // calculamos la cantidad de productos
      this.listaProductos$.subscribe(result => {     
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


