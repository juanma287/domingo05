import { Component} from '@angular/core';
import { NavController, ToastController, AlertController, LoadingController, PopoverController, NavParams} from 'ionic-angular';;
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { Compra } from '../../../model/compra/compra.model';
import { Detalle } from '../../../model/detalle/detalle.model';
import { Producto } from '../../../model/producto/producto.model';
//import { CuentaGeneral } from '../../../model/cuenta-general/cuenta-general.model';
import { ProductoService } from '../../../services/producto.service'
import { AnotacionesService } from '../../../services/anotaciones.service'
//import { ComercioService } from '../../../services/comercio.service';
import { BuscarCuentaPage } from "../../gestion-anotaciones/buscar-cuenta/buscar-cuenta";
import {ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'anotar',
  templateUrl: 'anotar.html',
})
export class Anotar {
 
   public compra: Compra = {
      total_compra: 0,
      fecha_compra:'',
      fecha_compra_number: 0,
      estado: 'intacta',
      tipo: '',
      observacion: '',
    };

   // Lista de detalles que forman parte de la compra 
   public listaDetalle: Array<Detalle> = [
   {
      id_producto: 0,
      nombre_producto:'',
      unidad: '',
      precio: 0,
      cantidad: '',
      total_detalle: '',
   }];

   // lista de productos que tiene el comercio y el producto elegido en un detalle
   listaProductos$: Observable<Producto[]>
   productoDetalle$:Observable<Producto[]>

   // cuenta en la que anotaremos 
   cuenta: Cuenta;
   valoresCuenta:any;
   key_cuenta:any;
   total_deuda: any;
   total_items : number;
   entrega: boolean; // si entrega o no entrega dinero
    
   // fecha y monto de la compra 
   fechaParaHTML:string;
   pipe = new DatePipe('es'); 
   fecha_compra_number : any;
   fecha_compra:any;
   monto_compra: number = 0;


  constructor(
   	 public navCtrl: NavController,
     private anotacionesService: AnotacionesService,
  	 private productoService: ProductoService,
  	 public loading: LoadingController,
     public alertCtrl: AlertController,
     public popoverCtrl: PopoverController,
     public navParams: NavParams,
     public toastCtrl: ToastController
  	 ) 
	  {
     // leemos el parametro y cargamos los valores en la variable valoresCuenta
     this.cuenta = this.navParams.data;
     this.valoresCuenta = (<any>Object).values(this.cuenta);
     this.valoresCuenta = this.valoresCuenta['0'];
     this.key_cuenta = this.valoresCuenta.key
     this.total_deuda = this.valoresCuenta.total_deuda;
     
     this.fechaParaHTML = new Date().toISOString();
     this.fecha_compra = this.pipe.transform(this.fechaParaHTML ,'dd/MM/yyyy');
     this.fecha_compra_number = new Date(this.fechaParaHTML).getTime();

     // por defecto no entrega dinero
     this.entrega = false;
     this.total_items = 1;


	  }

  ionViewDidLoad() {
       // traemos los productos del comercio
       let loader = this.loading.create({  content: 'Pocesando…',  });
       loader.present().then(() => {
          
           this.listaProductos$ = this.productoService.getListaCompleta()
           .snapshotChanges().map(changes => {
             return changes.map (c => ({
             key: c.payload.key, ...c.payload.val()
            }));
          });   

       // finalizo loader
       loader.dismiss()                     
       });
  }

  anotar()
  {

     var estadoConexion = this.anotacionesService.estadoConex;
     if(estadoConexion)
     {
          // show message
          let toast = this.toastCtrl.create({
            message: 'Guardado con éxito!',
            duration: 1500,
            position: 'bottom',
            cssClass: "yourCssClassName",
          });

          let loader = this.loading.create({  content: 'Pocesando…',  });
          loader.present().then(() => {

            this.inicializarCompra();
            this.anotacionesService.agregarCompra(this.key_cuenta,this.compra).then(ref => {
              let key_compra = ref.key;
              if(key_compra != undefined)
               {
                 let length = this.listaDetalle.length;
                 for (var i = 0; i < length; ++i) 
                 {
                  this.anotacionesService.agregarDetalle(this.key_cuenta, key_compra,this.listaDetalle[i]);
                 }
                 // actualizamos la cuenta del comercio y la cuenta general
                 this.anotacionesService.actualizarCuentaComercio(this.key_cuenta, this.total_deuda, this.compra.total_compra, this.entrega, this.compra.fecha_compra,  this.compra.fecha_compra_number );
                 this.anotacionesService.actualizarCuentaGeneral(this.key_cuenta, this.total_deuda,this.compra.total_compra, this.entrega, this.compra.fecha_compra, this.compra.fecha_compra_number);
                      // finalizo loader
                 loader.dismiss(); 
                 toast.present();   
                 this.navCtrl.pop();
               } 
               else
               {
                 alert("se produjo un error y no se almaceno la compra");
               }           
            })
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

  // completamos los datos de la compra
  inicializarCompra(){
     this.compra.total_compra = this.monto_compra;
     this.compra.fecha_compra = this.fecha_compra;
     // se pone negativa para poder ordenar desendente con firebase
     this.compra.fecha_compra_number = this.fecha_compra_number * -1;
     if(this.entrega)
     {
       this.compra.tipo = "entrega";
     }
     else
     {
       this.compra.tipo = "anota"
     }

  }


  cambiarFecha()  {
    this.fecha_compra = this.pipe.transform(this.fechaParaHTML ,'dd/MM/yyyy');
    this.fecha_compra_number = new Date(this.fechaParaHTML).getTime();
  }

  agregarDetalle() {
    let detalle = {
        id_producto:0,
        nombre_producto:'',
        cantidad:'',
        unidad:'',
        precio: 0,
        total_detalle:0
        }
    this.listaDetalle.push(detalle);   
    this.total_items = this.total_items +1; 
   
  }

  // por defecto eleiminamos el ultimo item
  eliminarDetalle() {
    this.listaDetalle.pop();
    if(this.listaDetalle.length == 0) // si no hay ningun detalle tampoco hay entrega
      this.entrega = false;
    
    this.total_items = this.total_items - 1;  
    this.calcularTotalCompra();
  }

 // se ejecuta cuando cargamos la cantidad de un producto
 onChangeCantidad(indice){
  this.listaDetalle[indice].total_detalle = this.listaDetalle[indice].cantidad * this.listaDetalle[indice].precio;
  this.listaDetalle[indice].total_detalle = this.truncateDecimals(this.listaDetalle[indice].total_detalle,2);

  this.calcularTotalCompra();
 
 }

  // se ejecuta cuando elegimos el producto
 onChangeProducto(key,indice) {
    this.productoDetalle$ = this.listaProductos$
    .map( productos =>
           productos.filter( prod => prod.key === key)
      );
    
    this.productoDetalle$.subscribe(val => 
      {
        this.listaDetalle[indice].nombre_producto = val[0].nombre;
        this.listaDetalle[indice].id_producto = val[0].key;
        this.listaDetalle[indice].unidad = val[0].unidad;
        this.listaDetalle[indice].precio = val[0].precio;

        // LLamaos a este metodo por si cambia el producto luego de ingresar la cantidad
        this.onChangeCantidad(indice);


          if(val[0].unidad == "entrega" && this.total_items <= 1)
          {
             this.entrega = true;
          }
          else if(val[0].unidad == "entrega" && this.total_items > 1)
          {
             this.entrega = false;
                const alert = this.alertCtrl.create({
                title: 'Advertencia',
                subTitle: 'Si ingresa productos no puede ingresar entrega.',
                buttons: ['OK']
               });
               alert.present();
              }       
      }
    );
    

  }

 calcularTotalCompra(){
    let length = this.listaDetalle.length;
    let aux = 0;
    for (var i = 0; i < length; ++i) 
    {
      aux= aux + this.listaDetalle[i].total_detalle;
    }
    this.monto_compra = this.truncateDecimals(aux, 2);
 }
  
  truncateDecimals (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };


  volverHome() {
     this.navCtrl.pop();
  }

  configuaraciones(myEvent) {
    let popover = this.popoverCtrl.create(ConfiguaracionesPage);
    popover.present({
      ev: myEvent
    });
  }

}
