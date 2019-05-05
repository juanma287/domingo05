import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Comercio } from '../model/comercio/comercio.model';


 
@Injectable()
export class ComercioService {
 
    private listaComercios = this.db.list<Comercio>('lista-comercio');
    public estadoConex: any;

    constructor(private db: AngularFireDatabase) 
    {
         // chequeamos el estado de la conexion 
         var connectedRef = this.db.object(".info/connected").valueChanges();
         connectedRef.subscribe(estadoConexion => 
                                {
                                    this.estadoConex = estadoConexion;                    
                                });
    }
 
    getListaComercios() {
        return this.listaComercios;
    }
 
    agregarComercio(comercio: Comercio) {   

            return this.listaComercios.push(comercio);     

    }
 
    actualizarComercio(comercio: Comercio) {
     
        return this.listaComercios.update(comercio.key, comercio).then(error => console.log(error));
    }
 
    eliminarComercio(comercio: Comercio) {
      
        return this.listaComercios.remove(comercio.key);
    }



}