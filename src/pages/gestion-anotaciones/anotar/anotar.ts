import { Component} from '@angular/core';
import { NavController, ToastController, AlertController, LoadingController, PopoverController, NavParams} from 'ionic-angular';;
import { Cuenta } from '../../../model/cuenta/cuenta.model';
import { Compra } from '../../../model/compra/compra.model';
import { Detalle } from '../../../model/detalle/detalle.model';
import { AnotacionesService } from '../../../services/anotaciones.service'
//import { ComercioService } from '../../../services/comercio.service';
import {ConfiguaracionesPage} from "../../configuaraciones/configuaraciones";
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators';



@Component({
  selector: 'anotar',
  templateUrl: 'anotar.html',
})
export class Anotar {
   SubscriptionCuenta: Subscription;

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
      porcentaje_saldado:0
   }];

   // lista de productos que tiene el comercio y el producto elegido en un detalle
   productoDetalleArray:any;
   listadeProductosArray:any;


   // cuenta en la que anotaremos 
   cuenta: Cuenta;
   valoresCuenta:any;
   key_cuenta:any;
   total_deuda: any;
   total_items : number;
   saldado_hasta_fecha: number; // hasta que fecha se encuentra saldada una cuenta 
   saldado_hasta_fecha_new: number; // hasta que fecha se encuentra saldada una cuenta luego de una ENTREGA
   auxMontoSaldado:number;
    
   // fecha y monto de la compra 
   fechaParaHTML:string;
   pipe = new DatePipe('es'); 
   fecha_compra_number : any;
   fecha_compra:any;
   monto_compra: number = 0;
   // lo usamos para las pestañas (ion-segment)
   operacion: string;
   msjError: string;
   salda_el_total: boolean;

   // lista de compras de un cliente
   listaCompras$: Observable<Compra[]>
   listaDetalle$: Observable<Detalle[]>

  constructor(
      public navCtrl: NavController,
     private anotacionesService: AnotacionesService,
     public loading: LoadingController,
     public alertCtrl: AlertController,
     public popoverCtrl: PopoverController,
     public navParams: NavParams,
     public toastCtrl: ToastController,
     public storage: Storage
     ) 
    {
     // leemos el parametro y cargamos los valores en la variable valoresCuenta
     this.cuenta = this.navParams.data;
     this.valoresCuenta = (<any>Object).values(this.cuenta);
     this.valoresCuenta = this.valoresCuenta['0'];
     this.key_cuenta = this.valoresCuenta.key
     this.total_deuda = this.valoresCuenta.total_deuda;
     this.saldado_hasta_fecha = this.valoresCuenta.saldado_hasta_fecha;
     this.saldado_hasta_fecha_new = 0; // hasta que fecha se encuentra saldada una cuenta luego de una ENTREGA
      
     this.fechaParaHTML = new Date().toISOString();
     this.fecha_compra = this.pipe.transform(this.fechaParaHTML ,'dd/MM/yyyy');
     this.fecha_compra_number = new Date(this.fechaParaHTML).getTime();

     this.total_items = 1;
     this.operacion = "anota";
     this.msjError = '';
     this.salda_el_total = false;

    }
      


  ionViewDidLoad() {
     this.storage.get('productos').then((val) => {
                               this.listadeProductosArray = val;
                  });
  }

 // cuando se cambia de pestania se pierde la info de la pestaña anterior
 cambiaPestania()
 {
   this.listaDetalle = [
   {
      id_producto: 0,
      nombre_producto:'',
      unidad: '',
      precio: 0,
      cantidad: '',
      total_detalle: '',
      porcentaje_saldado: 0
   }];
   this.calcularTotalCompra();
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
          
       this.inicializarCompra();
       if(this.msjError === '') // si no hay msj de error comenzamos a procesar la compra
        {
          let loader = this.loading.create({  content: 'Pocesando…',  });
          loader.present().then(() => {

          this.anotacionesService.agregarCompra(this.key_cuenta,this.compra).then(ref => {
          let key_compra = ref.key;
          if(key_compra != undefined)
            {
              let length = this.listaDetalle.length;
              for (var i = 0; i < length; ++i) 
              {
                this.anotacionesService.agregarDetalle(this.key_cuenta, key_compra,this.listaDetalle[i]);
              }
              // actualizamos la cuenta del comercio 
              this.anotacionesService.actualizarCuentaComercio(this.key_cuenta, this.total_deuda, this.compra.total_compra, this.operacion, this.compra.fecha_compra,  this.compra.fecha_compra_number );
              
              // SI SE TRATA DE UNA ENTREGA, MARCAMOS LAS COMPRAS QUE CORRESPONDAN COMO PAGADAS
              if(this.operacion === "entrega")
              {
               if(this.saldado_hasta_fecha === 0) // traemos todas las anotaciones de la cuenta xq es la primera vez que paga
               {
                   // traemos la lista de TODAS las complas del cienente 
                   this.listaCompras$ = this.anotacionesService.getCompras(this.key_cuenta)
                       .snapshotChanges().map(changes => {
                         return changes.map (c => ({
                         key: c.payload.key, ...c.payload.val()
                       }));
                     });                    
        
                   // CASO 1: Es la primera vez que paga y salda el total
                   if(this.salda_el_total) 
                   { 
                     this.caso1();              
                   }
                   // CASO 2: Es la primera vez que paga y salda de forma parcial
                   else
                   {
                     this.caso2(); 
                   }           
               } 
               else  // No es la primera vez que paga
               {      
                   // traemos la lista de las compras aún NO saldadas  
                   this.listaCompras$ = this.anotacionesService.getComprasNoSaldadas(this.key_cuenta, this.saldado_hasta_fecha)
                       .snapshotChanges().map(changes => {
                         return changes.map (c => ({
                         key: c.payload.key, ...c.payload.val()
                       }));
                     });  

                   // CASO 3: No es la primera vez que paga y sada de forma total             
                  if(this.salda_el_total) 
                  { 
                     this.caso3();                
                  }
                   // CASO 4: No es la primera vez que paga y salda de forma parcial
                  else
                  {
                     this.caso4();
                  }
                }             
              }

              // finalizo loader
              loader.dismiss(); 
              toast.present();   
              this.navCtrl.pop();
             } 
             else
               {
                 alert("se produjo un error y no se almaceno la compra, vuelva a intentarlo");
               }           
            })
          }) 
        }            
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

  // quitamos la suscripcion al observable
  ngOnDestroy() {
      if(this.SubscriptionCuenta && !this.SubscriptionCuenta.closed)
           this.SubscriptionCuenta.unsubscribe();            
  }

  // CASO 1: Es la primera vez que paga y salda el total
  caso1()  
  {
      this.SubscriptionCuenta = this.listaCompras$.pipe(take(1)).subscribe((result: any[]) => {    
                        let length = result.length;
                        for (var i = 0; i < length; ++i) 
                        {
                          if(result[i].estado == "intacta" && (result[i].tipo == "anota" || result[i].tipo == "actualiza"))
                          {
                             this.anotacionesService.actulizarCASO1(this.key_cuenta, result[i].key);
                            // en este caso tomamos la fecha de la ultima compra                         
                          }
                        }

                        this.saldado_hasta_fecha_new = result[0].fecha_compra_number;
                        // Actualizamos la cuenta :: el saldado hasta la fecha                                               
                        this.anotacionesService.actualizarSaldadoHastaFecha(this.key_cuenta,this.saldado_hasta_fecha_new );                  
                       });  
  }

  // CASO 2: Es la primera vez que paga y salda de forma parcial
  caso2() 
  {
      this.SubscriptionCuenta = this.listaCompras$.pipe(take(1)).subscribe((result : any[])=> {  
                        this.auxMontoSaldado = this.monto_compra;
                        let length = result.length;
                        let ingresoAldetalle = false;

                        for (var i = length-1; i >= 0; --i) 
                        {
                           
                          if(result[i].estado == "intacta" && (result[i].tipo == "anota" || result[i].tipo == "actualiza"))
                            {  
                              if(this.auxMontoSaldado >= result[i].total_compra && !ingresoAldetalle)
                              {
                               this.anotacionesService.actulizarCASO1(this.key_cuenta, result[i].key);
                               this.auxMontoSaldado = this.auxMontoSaldado - result[i].total_compra;
                               this.saldado_hasta_fecha_new = result[i].fecha_compra_number;
                              }
                              else if(!ingresoAldetalle) // ENTRAMOS AL DETALLE
                              {
                                    ingresoAldetalle = true;
                                    let key_compra = result[i].key;
                                    this.saldado_hasta_fecha_new = result[i].fecha_compra_number;                                  
                                  
                                    // traemos el detalle
                                    this.listaDetalle$ = this.anotacionesService.getDetalle(this.key_cuenta, result[i].key)
                                       .snapshotChanges().map(changes => {
                                         return changes.map (c => ({
                                         key: c.payload.key, ...c.payload.val()
                                       }));
                                     });  
                                     
                                     this.listaDetalle$.pipe(take(1)).subscribe((result2: any[]) => {  

                                     let length2 = result2.length;
                                     let faltaSaldar = 0;
                                     // recorremos el detalle y marcamos el porcentaje saldado

                                     for (var j = 0; j < length2; ++j) 
                                      {
                                        if(this.auxMontoSaldado >= result2[j].total_detalle)
                                        {
                                          this.auxMontoSaldado = this.auxMontoSaldado - result2[j].total_detalle;
                                          this.anotacionesService.actulizarCASO2Detalle(this.key_cuenta, key_compra, result2[j].key, 100);
                                        }
                                        else
                                        {
                                          let porcentaje = this.auxMontoSaldado / result2[j].total_detalle;
                                          this.auxMontoSaldado = 0;
                                          faltaSaldar += (1 - porcentaje) * result2[j].total_detalle;
                                          this.anotacionesService.actulizarCASO2Detalle(this.key_cuenta, key_compra, result2[j].key, porcentaje);
                                        }                  
                                      }  
                                    // Actualizamos la compra: la tildamos como saldada para que no pueda ser anulada
                                    this.anotacionesService.actulizarCASO2Compra(this.key_cuenta, key_compra, faltaSaldar);   

                                    });    
                                  
                                   }
                                 } 
                              }
                              // Actualizamos la cuenta :: el saldado hasta la fecha                                               
                              this.anotacionesService.actualizarSaldadoHastaFecha(this.key_cuenta,this.saldado_hasta_fecha_new );
                            }           
                      );  
  }

  caso3()
  {
     this.SubscriptionCuenta = this.listaCompras$.pipe(take(1)).subscribe((result3: any[]) => {    
           let length3 = result3.length;                       
           for (var i = 0; i < length3; ++i) 
           {
            if((result3[i].estado == "intacta" || result3[i].estado == "parcialmente saldada") && (result3[i].tipo == "anota" || result3[i].tipo == "actualiza"))
               {
                this.anotacionesService.actulizarCASO1(this.key_cuenta, result3[i].key);
                }
           }
           this.saldado_hasta_fecha_new = result3[0].fecha_compra_number;           
           // Actualizamos la cuenta :: el saldado hasta la fecha                                               
           this.anotacionesService.actualizarSaldadoHastaFecha(this.key_cuenta,this.saldado_hasta_fecha_new );                  
      });    
  }

  caso4()
  {
      this.SubscriptionCuenta = this.listaCompras$.pipe(take(1)).subscribe((result4: any[]) => {  
          this.auxMontoSaldado = this.monto_compra;
          let length = result4.length;
          let ingresoAldetalle = false;

          for (var i = length-1; i >= 0; --i) 
          {
           if((result4[i].estado == "intacta" || result4[i].estado == "parcialmente saldada") && (result4[i].tipo == "anota" || result4[i].tipo == "actualiza"))
           { 

             if(this.auxMontoSaldado >= result4[i].total_compra && result4[i].estado == "intacta" && !ingresoAldetalle)
             {
                this.anotacionesService.actulizarCASO1(this.key_cuenta, result4[i].key);
                this.auxMontoSaldado = this.auxMontoSaldado - result4[i].total_compra;
                this.saldado_hasta_fecha_new = result4[i].fecha_compra_number;
             }

             else if(result4[i].estado == "parcialmente saldada" && this.auxMontoSaldado >= result4[i].falta_saldar && !ingresoAldetalle)
             {
                this.anotacionesService.actulizarCASO1(this.key_cuenta, result4[i].key);
                this.auxMontoSaldado = this.auxMontoSaldado - result4[i].falta_saldar;
                this.saldado_hasta_fecha_new = result4[i].fecha_compra_number;
             }

             else if(!ingresoAldetalle) // ENTRAMOS AL DETALLE
             {
               ingresoAldetalle = true;
               let key_compra = result4[i].key;
               this.saldado_hasta_fecha_new = result4[i].fecha_compra_number;
                                                   
               // traemos el detalle
               this.listaDetalle$ = this.anotacionesService.getDetalle(this.key_cuenta, result4[i].key)
                      .snapshotChanges().map(changes => {
                       return changes.map (c => ({
                       key: c.payload.key, ...c.payload.val()
                          }));
                       });  
                                     
               // ENTRAMOS AL DETALLE
               this.listaDetalle$.pipe(take(1)).subscribe((result5: any[]) => {  
                 let length5 = result5.length;
                 let faltaSaldar = 0;

                  // recorremos el detalle y marcamos el porcentaje saldado                                     
                  for (var j = 0; j < length5; ++j) 
                   {
                     if(result5[j].porcentaje_saldado != 100)  
                     {
                       if(this.auxMontoSaldado >= ((1 - result5[j].porcentaje_saldado) * result5[j].total_detalle))
                        {
                          this.auxMontoSaldado = this.auxMontoSaldado - ((1 - result5[j].porcentaje_saldado) * result5[j].total_detalle);
                          this.anotacionesService.actulizarCASO2Detalle(this.key_cuenta, key_compra, result5[j].key, 100);
                        }
                       else
                        {
                          let nuevoPorcentaje = (this.auxMontoSaldado / result5[j].total_detalle) + result5[j].porcentaje_saldado;
                          this.auxMontoSaldado = 0;
                          faltaSaldar += (1 - nuevoPorcentaje) * result5[j].total_detalle;
                          this.anotacionesService.actulizarCASO2Detalle(this.key_cuenta, key_compra, result5[j].key, nuevoPorcentaje);
                        }       
                      }                                         
                    } 
                     // Actualizamos la compra: la tildamos como saldada para que no pueda ser anulada
                     this.anotacionesService.actulizarCASO2Compra(this.key_cuenta, key_compra, faltaSaldar);                   
                   });                                      
                }
              } 
            }
                // Actualizamos la cuenta :: el saldado hasta la fecha                                               
               this.anotacionesService.actualizarSaldadoHastaFecha(this.key_cuenta,this.saldado_hasta_fecha_new );
             });         
  }

  // completamos los datos de la compra
  inicializarCompra(){
     this.compra.total_compra = this.monto_compra;
     this.compra.fecha_compra = this.fecha_compra;
     // se pone negativa para poder ordenar desendente con firebase
     this.compra.fecha_compra_number = this.fecha_compra_number * -1;
     this.compra.tipo = this.operacion;


    // VALIDACIONES
    let length = this.listaDetalle.length;
    let aux = true;
    for (var i = 0; i < length; ++i) 
    {
     if(this.listaDetalle[i].cantidad == '')
     {
       aux = false;
       this.msjError = "Cargo un item de forma incompleta";
     }
     if(this.listaDetalle[i].total_detalle < 0)
     {
       aux = false;
       this.msjError = "No puede ingresar valores negativos";
     } 
    }
    if(aux)   
      this.msjError = '';
     
    if(isNaN(this.compra.total_compra))
      this.msjError = "Ingreso caracteres inválidos";
 
    if(this.compra.total_compra == 0)
      this.msjError = "No ingreso valores";

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
        total_detalle:0,
        porcentaje_saldado:0
        }
    this.listaDetalle.push(detalle);   
    this.total_items = this.total_items +1; 
   
  }

  // por defecto eleiminamos el ultimo item
  eliminarDetalle() {
    this.listaDetalle.pop();
    this.total_items = this.total_items - 1;  
    this.calcularTotalCompra();
    this.msjError = '';
  }

 // se ejecuta cuando cargamos la cantidad de un producto
 onChangeCantidad(indice){
  this.listaDetalle[indice].total_detalle = this.listaDetalle[indice].cantidad * this.listaDetalle[indice].precio;
  this.listaDetalle[indice].total_detalle = this.truncateDecimals(this.listaDetalle[indice].total_detalle,2);

  this.calcularTotalCompra();
  this.msjError = '';
 }

  // se ejecuta cuando elegimos el producto
 onChangeProducto(key,indice) {
    this.productoDetalleArray = this.listadeProductosArray.filter( prod => prod.key === key);

        this.listaDetalle[indice].nombre_producto = this.productoDetalleArray[0].nombre;
        this.listaDetalle[indice].id_producto = this.productoDetalleArray[0].key;
        this.listaDetalle[indice].unidad = this.productoDetalleArray[0].unidad;
        this.listaDetalle[indice].precio = this.productoDetalleArray[0].precio;

        // LLamaos a este metodo por si cambia el producto luego de ingresar la cantidad
        this.onChangeCantidad(indice);    
  }

  onChangeEntrega(key,indice)
  {
    this.listaDetalle[indice].nombre_producto = "entrega";
    this.listaDetalle[indice].id_producto = "";
    this.listaDetalle[indice].unidad = "entrega";
    this.listaDetalle[indice].precio = 1;
    if(key == "total")
    {
        this.salda_el_total = true;
        this.listaDetalle[indice].cantidad = this.total_deuda;
        this.onChangeCantidad(indice);

    }
    else
    {
      this.salda_el_total = false;
      this.listaDetalle[indice].cantidad = '';
    }
  }

  cargarActualizacion(indice)
  {
    this.listaDetalle[indice].nombre_producto = "actualiza";
    this.listaDetalle[indice].id_producto = "";
    this.listaDetalle[indice].unidad = "actualiza";
    this.listaDetalle[indice].precio = 1;
    this.onChangeCantidad(indice);
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