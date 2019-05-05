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
var ComercioService = /** @class */ (function () {
    function ComercioService(db) {
        var _this = this;
        this.db = db;
        this.listaComercios = this.db.list('lista-comercio');
        // chequeamos el estado de la conexion 
        var connectedRef = this.db.object(".info/connected").valueChanges();
        connectedRef.subscribe(function (estadoConexion) {
            _this.estadoConex = estadoConexion;
        });
    }
    ComercioService.prototype.getListaComercios = function () {
        return this.listaComercios;
    };
    ComercioService.prototype.agregarComercio = function (comercio) {
        return this.listaComercios.push(comercio);
    };
    ComercioService.prototype.actualizarComercio = function (comercio) {
        return this.listaComercios.update(comercio.key, comercio).then(function (error) { return console.log(error); });
    };
    ComercioService.prototype.eliminarComercio = function (comercio) {
        return this.listaComercios.remove(comercio.key);
    };
    ComercioService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFireDatabase])
    ], ComercioService);
    return ComercioService;
}());
export { ComercioService };
//# sourceMappingURL=comercio.service.js.map