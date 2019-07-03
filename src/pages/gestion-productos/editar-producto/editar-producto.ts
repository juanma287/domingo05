import { Component } from '@angular/core';
import { NavController,AlertController, NavParams,LoadingController, ToastController, PopoverController} from 'ionic-angular';
import { Producto } from '../../../model/producto/producto.model';
import { ProductoService } from '../../../services/producto.service';
import {ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { Compra } from '../../../model/compra/compra.model';
import { CuentaService } from '../../../services/cuenta.service';
import { AnotacionesService } from '../../../services/anotaciones.service';
import { Detalle } from '../../../model/detalle/detalle.model';


@Component({
  selector: 'page-editar-producto',
  templateUrl: 'editar-producto.html',
})
export class EditarProductoPage {

  producto: Producto 
  precio_original: any
  msjError: string
  listaCuentas$: Observable<Cuenta[]>
  listaCompras$: Observable<Compra[]>
  listaDetalle$: Observable<Detalle[]>
  SubscriptionCuenta: Subscription;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private productoService: ProductoService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    private cuentaService: CuentaService,
    private anotacionesService: AnotacionesService
    ) 
  {   
     this.msjError = '';
  }

  ionViewWillLoad() {
   this.producto = this.navParams.get('producto');
   this.precio_original = this.producto.precio;

  }
 
 
  actualizar(producto: Producto) {


     if(this.producto.precio < 0)
     {
       this.msjError = "No puede ingresar valores negativos";
     }
     else if ( this.producto.precio.toString().length == 0)
     {
       this.msjError = "El precio no puede estar vacio";
     }
     else
     {
       this.msjError = '';
     }   


  if(this.msjError === '') // si no hay msj de error comenzamos a procesar
  {
            // show message
        let toast = this.toastCtrl.create({
          message: 'Producto actualizado!',
          duration: 2500,
          position: 'bottom',
          cssClass: "yourCssClassName",
        });

     
     // Si modifico el precio le preguntamos si desea que la acutalizacion sea retroactiva 
     if(this.precio_original != this.producto.precio)
     {
          let alert = this.alertCtrl.create({
          title: 'Consulta',
          message: '¿Desea que la actualización del precio sea retroactiva?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                  // codigo si presiona cancelar
                  let loader = this.loading.create({  content: 'Pocesando…',  });
                  loader.present().then(() => {
                  this.productoService.actualizar(producto).then(() => {
                        // finalizo loader
                       loader.dismiss(); 
                       toast.present();   
                       this.navCtrl.pop();
                  })
                });
              }
            },
            {
              text: 'Si',
              handler: () => {
                  let loader = this.loading.create({  content: 'Pocesando…',  });
                  loader.present().then(() => {
                  // Actualizamos todas las compras que no esten saldadas y tengan este producto
                  this.actualizarPrecioRetroactivamente(this.producto.key);
                  this.productoService.actualizar(producto).then(() => {
                       loader.dismiss(); 
                       toast.present();   
                       this.navCtrl.pop();
                  })
                })
              }
            }
          ]
        });
        alert.present();    
     }
     else
     {
              let loader = this.loading.create({  content: 'Pocesando…',  });
                loader.present().then(() => {
                this.productoService.actualizar(producto).then(() => {
                      // finalizo loader
                     loader.dismiss(); 
                     toast.present();   
                     this.navCtrl.pop();
                })
              });
     }
   }        
  }
 
 // Actualizamos todas las compras que no esten saldadas y tengan este producto
 actualizarPrecioRetroactivamente(key_prodcuto)
 {

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
         // Si nunca compro, directamente no traemos sus anotaciones
          if(result[i].fecha_ultima_compra_number != 0) 
          {
                  this.ejecutarAtualizado(result[i].key, key_prodcuto, result[i].total_deuda);
          }  
         }                 
   });
 }

 ejecutarAtualizado(key_cuenta, key_prodcuto, total_deuda)
  {

   this.listaCompras$ = this.anotacionesService.getComprasAnotaIntacta(key_cuenta)
            .snapshotChanges().map(changes => {
                     return changes.map (c => ({
                     key: c.payload.key, ...c.payload.val()
                 }));
            });     

   this.listaCompras$.pipe(take(1)).subscribe((result: any[]) => {    
                let length = result.length;
                let total_deuda_actualizada = total_deuda;

                for (var i = 0; i < length; ++i) 
                {
                 if(result[i].tipo == "anota")
                 {
                   let total_compra = result[i].total_compra;
                   let key_compra = result[i].key;
                   // debemos analizar si en dicha compra hay un producto a acutalizar 
                   // Por lo que traemos el detalle de la compra                    
                   this.listaDetalle$ = this.anotacionesService.getDetalleProducto(key_cuenta, key_compra, key_prodcuto)
                        .snapshotChanges().map(changes => {
                         return changes.map (c => ({
                         key: c.payload.key, ...c.payload.val()
                        }));
                     });    

                   this.listaDetalle$.pipe(take(1)).subscribe((result2: any[]) => {  
                   let total_detalle = result2[0].total_detalle;
                   let key_detalle = result2[0].key;
                   let nuevo_precio = this.producto.precio;
                   let nuevo_total_detalle = result2[0].cantidad * nuevo_precio;

                   // PASO 1: Restamos al total_deuda el total_compra (que será actualizado)
                   let total_deuda_sin_compra = total_deuda_actualizada - total_compra;

                   // PASO 2: Restamos al total_compra el total_detalle (que será actualizado)
                   let total_compra_sin_detalle = total_compra - total_detalle;

                   // PASO 3: Actualizamos el detalle
                   this.anotacionesService.actulizarDetallePASO3(key_cuenta, key_compra, key_detalle, nuevo_precio, nuevo_total_detalle);
                 
                   // PASO 4: Sumamos al total_compra el NUEVO total_detalle (ya actualizado)

                   let total_compra_nuevo = total_compra_sin_detalle + nuevo_total_detalle;
                   this.anotacionesService.actualizarTotalCompraPASO4(key_cuenta, key_compra, total_compra_nuevo);
                  
                
                   // PASO 5: Sumamos al total_deuda el NUEVO total_compra (ya actualizado)
                   let total_deuda_nuevo = total_deuda_sin_compra + total_compra_nuevo;
                   total_deuda_actualizada = total_deuda_nuevo; 

                   this.anotacionesService.actualizarTotalDeudaComercioPASO5(key_cuenta, total_deuda_nuevo);


                   });        
                 }
                }

               });  
  }

   // quitamos la suscripcion al observable
  ngOnDestroy() {
      if(this.SubscriptionCuenta && !this.SubscriptionCuenta.closed)
           this.SubscriptionCuenta.unsubscribe();            
  }


  eliminar(producto: Producto) {

      let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Esta seguro que desea eliminar el producto?',
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
                  message: 'Producto eliminado!',
                  duration: 1500,
                  position: 'bottom',
                  cssClass: "yourCssClassName",
                });

               let loader = this.loading.create({  content: 'Pocesando…',  });
                     loader.present().then(() => {
                     this.productoService.eliminar(producto).then(() => {
                      // finalizo loader
                       loader.dismiss(); 
                       toast.present();   
                       this.navCtrl.pop();
                  })
                });
          }
        }
      ]
    });
    alert.present();    
  }


  onChange(value) {
 // console.log(value);

  }
  
  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }
}