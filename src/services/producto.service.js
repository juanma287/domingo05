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
var ProductoService = /** @class */ (function () {
    function ProductoService(db, storage) {
        var _this = this;
        this.db = db;
        this.storage = storage;
        // chequeamos el estado de la conexion 
        var connectedRef = this.db.object(".info/connected").valueChanges();
        connectedRef.subscribe(function (estadoConexion) {
            _this.estadoConex = estadoConexion;
        });
        // nos fijamos que usuario se encuentra conectado y obtenemos el ID de su comercio
        this.storage.get('usuario').then(function (val) {
            _this.usuario = val;
            _this.url = 'lista-comercio/' + _this.usuario.id_comercio + '/productos';
            _this.listaPorductos = _this.db.list(_this.url);
        });
    }
    ProductoService.prototype.getLista = function () {
        return this.listaPorductos;
    };
    ProductoService.prototype.agregar = function (producto) {
        return this.listaPorductos.push(producto);
    };
    ProductoService.prototype.actualizar = function (producto) {
        return this.listaPorductos.update(producto.key, producto).then(function (error) { return console.log(error); });
    };
    ProductoService.prototype.eliminar = function (producto) {
        return this.listaPorductos.remove(producto.key);
    };
    ProductoService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFireDatabase,
            Storage])
    ], ProductoService);
    return ProductoService;
}());
export { ProductoService };
//# sourceMappingURL=producto.service.js.map