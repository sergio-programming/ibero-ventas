import Backbone, { $ } from "backbone";
import _ from "underscore";

const VentaDetalle = Backbone.Model.extend({
	idAttribute: "_id",
	defaults: {
		_id: void 0,
		serial: 0,
		venta: void 0,
		producto: void 0,
		cantidad: 0,
		subtotal: 0
	}
});

const VentaDetalles = Backbone.Collection.extend({
	model: VentaDetalle
});

const Venta = Backbone.Model.extend({
	initialize: () => {
		console.log("Model", "venta realizadas");
	},
	idAttribute: "_id",
	defaults: {
		_id: void 0,
		serial: 0,
		cliente: void 0,
		estado: void 0,
		fecha: void 0,
		valor: 0,
		user: void 0,
		detalles: new VentaDetalles()
	}
});

const Ventas = Backbone.Collection.extend({
	initialize: () => {
		console.log("Collection", "venta realizadas");
	},
	model: Venta
});

export default {
	Venta: Venta,
	Ventas: Ventas,
	VentaDetalle: VentaDetalle,
	VentaDetalles: VentaDetalles
};
