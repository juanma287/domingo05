import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Cuenta } from '../model/cuenta/cuenta.model';
import { CuentaGeneral } from '../model/cuenta-general/cuenta-general.model';
import { Storage } from '@ionic/storage';
import { Usuario } from '../model/usuario/usuario.model';


@Injectable()
export class CuentaService {
 
    public estadoConex: any;
    usuario: Usuario;
    public url: string;
    public listaCuentasComercio: any;
    public listaCuentasGeneral: any;
    
    /*
    INFO:
    1 - cuando un negocio crea una cuenta, la misma se replica en lista-cuenta, para que en un futuro pueda
    ser accedida por el cliente.
    2 - cuando un negocio actualice una cuenta, la misma será actualizada en lista-cuenta
    3 - cuando un negocio elimine una cuenta, la misma NO será eliminada de lista-cuenta, solo se 
    cargara una fecha de baja (a fines de saber que dicha cuenta fue eliminada por el comercio)
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
              // luego traemos todas las cuentas que se encuentan creadas en el comercio donde trabaja el usuario
              this.storage.get('usuario').then((val) => {
                   this.usuario = val;
                   this.url ='lista-comercio/'+ this.usuario.id_comercio +'/cuentas';
                   this.listaCuentasComercio = this.db.list<Cuenta>(this.url); 

                   this.listaCuentasGeneral = this.db.list<CuentaGeneral>('lista-cuenta/'+this.usuario.id_comercio +'/',  
                   ref => ref.orderByChild('fecha_alta_number')); 
                  
                   // MODIFICAR LA FORMA DE ALMACENAR LA FECHA YA QUE NO LAS COMPARA BIEN

                   });
    }
 
    // MÉTODOS PARA LAS CUENTAS QUE TIENE ALMACENADA EL COMERCIO
    getLista() {
        return this.listaCuentasComercio;

    }

    // Retornamos las cuentas del comercio ordenadas de acurdo al parametro tipoOrden
    getListaOrderBy(tipoOrden)
    {
       let path =  'lista-comercio/'+ this.usuario.id_comercio +'/cuentas';
              
       switch(tipoOrden) { 
           case 'nombre': { 
              return this.db.list<Cuenta>(path,
              ref => ref.orderByChild('nombre'));               
           } 
          case 'fecha_alta_number': { 
              return this.db.list<Cuenta>(path,
              ref => ref.orderByChild('fecha_alta_number'));          
           } 
          case 'fecha_ultima_compra_number': { 
              return this.db.list<Cuenta>(path,
              ref => ref.orderByChild('fecha_ultima_compra_number'));          
           } 
          }
    }
 
    agregar(cuenta: Cuenta) {  

           return this.listaCuentasComercio.push(cuenta);   
    }
 
    actualizar(cuenta: Cuenta) {

        return this.listaCuentasComercio.update(cuenta.key, cuenta).then(error => console.log(error));
    }

    eliminar(cuenta: Cuenta) {
      
        return this.listaCuentasComercio.remove(cuenta.key);
    }


    // MÉTODOS PARA CUENTA GENERAL
    getCuentasGeneral() {
        
        return this.listaCuentasGeneral;
    }

    agregarCuentaGeneral(key_cuenta, cuenta_general: CuentaGeneral) {   
            
            let path =  'lista-cuenta/'+ this.usuario.id_comercio +'/'+ key_cuenta;
            return this.db.object(path).set(cuenta_general);      
       
    }

    actualizarCuentaGeneral(key_cuenta, nombre) {   
                      
      let path =  'lista-cuenta/'+ this.usuario.id_comercio +'/'+ key_cuenta;
      let data = {
                  nombre: nombre
                 }

      return this.db.object(path).update(data);
       
    } 


    // solo cargamos una fecha de baja
    eliminarCuentaGeneral(key_cuenta) {         
             
      let path =  'lista-cuenta/'+ this.usuario.id_comercio +'/'+ key_cuenta;
      let data = {
                  fecha_baja: new Date().toLocaleString()
                 }

      return this.db.object(path).update(data);
       
    } 


}