import Backbone from "backbone";

const Producto = Backbone.Model.extend({
	idAttribute: "_id",
	defaults: {
		_id: void 0,
		serial: 0,
		detalle: void 0,
		stock: 0,
		photo: void 0,
		categoria: void 0,
		precio: 0
	}
});

const Productos = Backbone.Collection.extend({
	model: Producto
});

export default { Producto: Producto, Productos: Productos };
