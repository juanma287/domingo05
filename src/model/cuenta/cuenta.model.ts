export interface Cuenta {
	key?: string;
    id_cliente: string;
    nombre: string;
    observacion: string;
    total_deuda: number;
    fecha_ultimo_pago:string;
    fecha_ultimo_pago_number: number;
    fecha_ultima_compra:string;
    fecha_ultima_compra_number: number;
    fecha_alta: string;
    fecha_alta_number:number;

}