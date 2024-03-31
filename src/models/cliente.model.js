import Backbone, { $ } from "backbone";
import _ from "underscore";

const Cliente = Backbone.Model.extend({
	initialize: () => {
		console.log("Initialize cliente");
	},
	idAttribute: "_id",
	defaults: {
		_id: void 0,
		cedula: void 0,
		nombres: void 0,
		apellidos: void 0
	}
});

const Clientes = Backbone.Collection.extend({
	initialize: () => {
		console.log("Initialize clientes");
	},
	model: Cliente
});

export default { Cliente: Cliente, Clientes: Clientes };
