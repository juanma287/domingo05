var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
var CuentaService = /** @class */ (function () {
    /*
    INFO:
    1 - cuando un negocio crea una cuenta, la misma se replica en lista-cuenta, para que en un futuro pueda
    ser accedida por el cliente.
    2 - cuando un negocio actualice una cuenta, la misma será actualizada en lista-cuenta
    3 - cuando un negocio elimine una cuenta, la misma NO será eliminada de lista-cuenta, solo se
    cargara una fecha de baja (a fines de saber que dicha cuenta fue eliminada por el comercio)
    */
    function CuentaService(db, storage) {
        var _this = this;
        this.db = db;
        this.storage = storage;
        // chequeamos el estado de la conexion 
        var connectedRef = this.db.object(".info/connected").valueChanges();
        connectedRef.subscribe(function (estadoConexion) {
            _this.estadoConex = estadoConexion;
        });
        // nos fijamos que usuario se encuentra conectado y obtenemos el ID de su comercio
        // luego traemos todas las cuentas que se encuentan creadas en el comercio donde trabaja el usuario
        this.storage.get('usuario').then(function (val) {
            _this.usuario = val;
            _this.url = 'lista-comercio/' + _this.usuario.id_comercio + '/cuentas';
            _this.listaCuentasComercio = _this.db.list(_this.url);
            _this.listaCuentasGeneral = _this.db.list('lista-cuenta/' + _this.usuario.id_comercio + '/', function (ref) { return ref.orderByChild('nombre'); });
            // MODIFICAR LA FORMA DE ALMACENAR LA FECHA YA QUE NO LAS COMPARA BIEN
        });
    }
    // MÉTODOS PARA LAS CUENTAS QUE TIENE ALMACENADA EL COMERCIO
    CuentaService.prototype.getLista = function () {
        return this.listaCuentasComercio;
    };
    CuentaService.prototype.agregar = function (cuenta) {
        return this.listaCuentasComercio.push(cuenta);
    };
    CuentaService.prototype.actualizar = function (cuenta) {
        return this.listaCuentasComercio.update(cuenta.key, cuenta).then(function (error) { return console.log(error); });
    };
    CuentaService.prototype.eliminar = function (cuenta) {
        return this.listaCuentasComercio.remove(cuenta.key);
    };
    // MÉTODOS PARA CUENTA GENERAL
    CuentaService.prototype.getCuentasGeneral = function () {
        return this.listaCuentasGeneral;
    };
    CuentaService.prototype.agregarCuentaGeneral = function (key_cuenta, cuenta_general) {
        var path = 'lista-cuenta/' + this.usuario.id_comercio + '/' + key_cuenta;
        return this.db.object(path).set(cuenta_general);
    };
    CuentaService.prototype.actualizarCuentaGeneral = function (key_cuenta, nombre) {
        var path = 'lista-cuenta/' + this.usuario.id_comercio + '/' + key_cuenta;
        var data = {
            nombre: nombre
        };
        return this.db.object(path).update(data);
    };
    // solo cargamos una fecha de baja
    CuentaService.prototype.eliminarCuentaGeneral = function (key_cuenta) {
        var path = 'lista-cuenta/' + this.usuario.id_comercio + '/' + key_cuenta;
        var data = {
            fecha_baja: new Date().toLocaleString()
        };
        return this.db.object(path).update(data);
    };
    CuentaService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFireDatabase, Storage])
    ], CuentaService);
    return CuentaService;
}());
export { CuentaService };
//# sourceMappingURL=cuenta.service.js.map