import Backbone, { $ } from "backbone";
import _ from "underscore";

const Auth = Backbone.Model.extend(
	{
		initialize: function () {
			console.log("Model", "auth");
		},
		defaults: {
			cedula: void 0,
			nombres: void 0,
			apellidos: void 0,
			email: void 0,
			clave: void 0,
			celular: void 0
		},
		validate: (/** @type {object} */ attrs, /** @type {any} */ options) => {
			let errors = {};

			if (attrs.cedula == "") {
				errors["cedula"] = "La cedula es un valor requerido";
			}
			if (attrs.nombres == "") {
				errors["nombres"] = "Los nombres es un valor requerido";
			}
			if (attrs.apellidos == "") {
				errors["apellidos"] = "Los apellidos es un valor requerido";
			}
			if (attrs.email == "") {
				errors["email"] = "El email es un valor requerido";
			}
			if (attrs.clave == "") {
				errors["clave"] = "La clave es un valor requerido";
			}
			return _.isEmpty(errors) === true ? null : errors;
		}
	},
	{
		renderErrors: function (/** @type {object} */ errors) {
			_.each(errors, (msj, key) => {
				$(`[data-alert="${key}"]`).html(msj);
			});
			setTimeout(() => {
				_.each(errors, (msj, key) => {
					$(`[data-alert="${key}"]`).html("");
				});
			}, 3000);
		}
	}
);

export default Auth;
