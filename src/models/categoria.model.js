import Backbone, { $ } from "backbone";
import _ from "underscore";

const Categoria = Backbone.Model.extend({
	initialize: () => {
		console.log("Initialize categoria");
	},
	idAttribute: "_id",
	defaults: {
		_id: void 0,
		serial: void 0,
		detalle: void 0,
		photo: void 0,
		tipo: void 0,
		estado: void 0
	}
});

const Categorias = Backbone.Collection.extend({
	initialize: () => {
		console.log("Initialize categorias");
	},
	model: Categoria
});

export default { Categoria: Categoria, Categorias: Categorias };
