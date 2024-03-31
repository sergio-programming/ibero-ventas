const Venta = require("../models/venta");
const Producto = require("../models/producto");
const VentaDetalle = require("../models/venta_detalle");

const _venta_detalles = [
    {
        venta: 1,
        producto: 1,
        cantidad: 2,
        subtotal: 4000
    },
    {
        venta: 1,
        producto: 2,
        cantidad: 2,
        subtotal: 16000
    },		
    {
        venta: 2,
        producto: 3,
        cantidad: 1,
        subtotal: 8000
    },
    {
        venta: 2,
        producto: 4,
        cantidad: 2,
        subtotal: 14000
    },
    {
        venta: 3,
        producto: 5,
        cantidad: 1,
        subtotal: 8000
    },
    {
        venta: 3,
        producto: 6,
        cantidad: 1,
        subtotal: 2000
    }
];

const Seeder = async function(){
    let ai = 0;
	while (ai < _venta_detalles.length)
    {
		let ventaDetalle = _venta_detalles[ai];
		const productoEntity = await Producto.findOne().where("serial").equals(ventaDetalle.producto);
		ventaDetalle.producto = productoEntity._id;

		const ventaEntity = await Venta.findOne().where("serial").equals(ventaDetalle.venta);
		ventaDetalle.venta = ventaEntity._id;
		
		const entity = new VentaDetalle(ventaDetalle);
		await entity.save();
		ai++;
	}
	return await VentaDetalle.find();
}

module.exports = { Seeder : Seeder };