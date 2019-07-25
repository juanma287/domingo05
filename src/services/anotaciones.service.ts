import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';

import { Compra } from '../model/compra/compra.model';
import { Detalle } from '../model/detalle/detalle.model';


import { Storage } from '@ionic/storage';
import { Usuario } from '../model/usuario/usuario.model';


@Injectable()
export class AnotacionesService {
 
    public estadoConex: any;
    usuario: Usuario;
    public key_comercio: any;
    public total_deuda:any;

    /*
    INFO:
    1 - cuando un negocio actualice o elimine una compra, la misma NO será eliminada, solo se 
    modifica el estado
    */

    constructor(private db: AngularFireDatabase, private storage: Storage) 
     {

             // chequeamos el estado de la conexion 
             var connectedRef = this.db.object(".info/connected").valueChanges();
             connectedRef.subscribe(estadoConexion => 
                                    {
                                        this.estadoConex = estadoConexion;                    
                                    });
              // nos fijamos que usuario se encuentra conectado y obtenemos el ID de su comercio
              this.storage.get('usuario').then((val) => {
                   this.usuario = val;
                   this.key_comercio = this.usuario.id_comercio;            
                
                   });
    }
 
    // MÉTODOS PARA LAS CUENTAS QUE TIENE ALMACENADA EL COMERCIO
    getLista() {
        //return this.listaCuentasComercio;
    }

    // retorna todas las compras de una cuenta
    getCompras(key_cuenta)
    {
      let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta;
      let listaCompras = this.db.list<Compra>(path,
              ref => ref.orderByChild('fecha_compra_number')); 
      return listaCompras;
    }

     // traemos todas las compras de una cuenta, anteriores a fecha de corte. 
     getComprasFechaDeCorte(key_cuenta, fecha_de_corte)
    {
      let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta;
      let listaCompras = this.db.list<Compra>(path,
              ref => ref.orderByChild('fecha_compra_number').startAt(fecha_de_corte)); 
      return listaCompras;
    }

    // traemos todas las compras de una cuenta, que cumplan:: tipo == "anota" AND estado == "intacta"
    getComprasAnotaIntacta(key_cuenta)
    {
      let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta;
      let listaCompras = this.db.list<Compra>(path,
              ref => ref.orderByChild('estado').equalTo("intacta")); 
      return listaCompras;
    }

    borrarCompra(key_cuenta, key_compra)
    {
     let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta;
     let listaCompras = this.db.list<Compra>(path).remove(key_compra);
     return  listaCompras;
    }

    getComprasNoSaldadas(key_cuenta, fecha_saldado_hasta)
    {
      let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta;
      let listaCompras = this.db.list<Compra>(path,
              ref => ref.orderByChild('fecha_compra_number').endAt(fecha_saldado_hasta)); 
      return listaCompras;
    }

     // retorna el detalle de una compra
    getDetalle(key_cuenta, key_compra)
    {
      let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta +'/'+ key_compra + '/detalle';
      let listaDetalle = this.db.list<Detalle>(path); 
      return listaDetalle;
    }

    // retorna los detalles de una compra que coincidan con key_producto
    getDetalleProducto(key_cuenta, key_compra, key_producto)
    {

      let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta +'/'+ key_compra + '/detalle';
      let listaDetalle = this.db.list<Detalle>(path,
              ref => ref.orderByChild('id_producto').equalTo(key_producto));
      return listaDetalle;
    }

    agregarCompra(key_cuenta, compra: Compra) {  

           let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta;
           let listaCuentasComercio = this.db.list<Compra>(path); 
           
           return listaCuentasComercio.push(compra);           
    }

    anularCompra(key_cuenta,key_compra)
    {
      let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta +'/'+ key_compra;
      let data =
         { 
           estado: "anulada",
           fecha_anula: new Date()
         }
        return this.db.object(path).update(data); 

    }


    agregarDetalle(key_cuenta, key_compra, detalle: Detalle)
    {
       let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta +'/'+ key_compra + '/detalle';
       let listaCompra = this.db.list<Detalle>(path); 
           
       return listaCompra.push(detalle);  

    }

    actualizarCuentaCompraAnulada(key_cuenta, total_deuda_nuevo)
    {
      let path =  'lista-comercio/'+ this.key_comercio+'/cuentas/'+ key_cuenta;
      let data =
         { 
           total_deuda: total_deuda_nuevo,
         }
       return this.db.object(path).update(data); 
    }



    // actualizamos el total de la deuda en la cuenta que tiene alamcenada el comercio
    actualizarCuentaComercio(key_cuenta, total_deuda_cuenta,  monto_compra, tipo, fecha_compra, fecha_compra_number, saldado_hasta_fecha) {   
      
      let path =  'lista-comercio/'+ this.key_comercio+'/cuentas/'+ key_cuenta;
      if(tipo == 'entrega') // si es entrega
      {
        let data =
         { 
           total_deuda: total_deuda_cuenta - monto_compra,
           fecha_ultimo_pago: fecha_compra,
           fecha_ultimo_pago_number: fecha_compra_number
         }
        return this.db.object(path).update(data); 

      }
      else  // si anota 
      {
        // si agrega una anotacion con fecha anterior al ultimo pago, debemos cambiar el saldado_hasta_fecha
        // ya que si no, al realizar un nuevo pago, no tendría en cuenta esta anotacion
        if(fecha_compra_number > saldado_hasta_fecha)
        {
          let data = 
            { 
                 total_deuda: total_deuda_cuenta + monto_compra,
                 fecha_ultima_compra: fecha_compra,
                 fecha_ultima_compra_number: fecha_compra_number,
                 saldado_hasta_fecha: fecha_compra_number
            }
          return this.db.object(path).update(data); 
        }
        else
        {
          let data = 
           { 
             total_deuda: total_deuda_cuenta + monto_compra,
             fecha_ultima_compra: fecha_compra,
             fecha_ultima_compra_number: fecha_compra_number
           }
          return this.db.object(path).update(data); 
        }
      }


    } 


  actulizarDetallePASO3(key_cuenta, key_compra, key_detalle, nuevo_precio, nuevo_total_detalle)
  {
    let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta +'/'+ key_compra + '/detalle/'+ key_detalle;

    let data =
         { 
           precio: nuevo_precio,
           total_detalle: nuevo_total_detalle,
         }
      return this.db.object(path).update(data);  

  }

    actualizarTotalCompraPASO4(key_cuenta, key_compra, total_compra_nuevo)
  {
      let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta +'/'+ key_compra;
      let data =
         { 
           total_compra: total_compra_nuevo,
         }
      return this.db.object(path).update(data);  
  }

    actualizarTotalDeudaComercioPASO5(key_cuenta, total_deuda_nuevo)
  {

       let path =  'lista-comercio/'+ this.key_comercio+'/cuentas/'+ key_cuenta;    
       let data =
         { 
           total_deuda: total_deuda_nuevo,
         }
        return this.db.object(path).update(data);   
  }

  // CASO 1: Es la primera vez que paga y salda el total (directamente actualizamos el estado de la compra, no entramos al detalle)
  actulizarCASO1(key_cuenta, key_compra)
  {
      let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta +'/'+ key_compra;
      let data =
         { 
           estado: "saldada",
         }
      return this.db.object(path).update(data);  
  }


    // CASO 1: Es la primera vez que paga y salda el total (directamente actualizamos el estado de la compra, no entramos al detalle)
 actulizarCASO2Compra(key_cuenta, key_compra, faltaSaldar)
  {
      let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta +'/'+ key_compra;
      let data =
         { 
           estado: "parcialmente saldada",
           falta_saldar: faltaSaldar,
         }
      return this.db.object(path).update(data);  
  }
  
 actulizarCASO2Detalle(key_cuenta, key_compra, key_detalle, porcentaje_sald)
 {

    let path =  'lista-compra/'+ this.key_comercio +'/'+ key_cuenta +'/'+ key_compra + '/detalle/'+ key_detalle;
   // console.log(path);
   // console.log(porcentaje_sald);
    let data =
         { 
           porcentaje_saldado: porcentaje_sald,
         }
      return this.db.object(path).update(data);  
 }
 
  actualizarSaldadoHastaFecha(key_cuenta, fecha_compra_number )
  { 

      let path =  'lista-comercio/'+ this.key_comercio+'/cuentas/'+ key_cuenta;
      let data =
         { 
           saldado_hasta_fecha: fecha_compra_number
         }
      return this.db.object(path).update(data); 

  }

    

}