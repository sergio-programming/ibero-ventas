import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";
import Utils from "../../lib/utils";
import moment from "moment";
import eventosDom from "../../lib/eventosDom";

const ViewVentaEdita = Backbone.View.extend({
	render: function () {
		let template = _.template(document.getElementById("tmp_venta_edita").innerHTML);

		this.model.entity.set("fecha", moment(this.model.entity.get("fecha")).format("YYYY-MM-DD"));
		this.model.entity.set("cedula", window.sessionStorage.getItem("cedula"));
		this.model.entity.set("avatar", window.sessionStorage.getItem("avatar"));
		console.log(this.model.entity.toJSON());

		$(this.$el).html(template(this.model.entity.toJSON()));
		eventosDom();
		return this;
	},
	events: {
		"click #btnRegresar": "regresarAction",
		"click #btnEnviar": "sendAction"
	},
	regresarAction: function (e) {
		e.preventDefault();
		if (window.confirm("Confirma que desea regresar a la lista de ventas") === false) {
			return false;
		} else {
			this.model.router.navigate("home/" + window.sessionStorage.getItem("cedula"), { trigger: true });
			this.remove();
		}
	},
	sendAction: function (e) {
		e.preventDefault();
		const cedula = window.sessionStorage.getItem("cedula");
		let scope = this;
		let formData = $("form").serializeArray();
		let token = {};
		_.each(formData, function (row, item) {
			if (row.name.indexOf("detalles") == -1) {
				token[row.name] = row.value;
			}
		});
		const entity = this.model.entity;
		const _id = entity.get("_id");
		entity.set(token);

		if (!entity.isValid()) {
			entity.renderErrors(entity.validationError);
			return false;
		}
		console.log("entity", entity.toJSON());

		if (window.confirm("Confirma que los datos son correctos para continuar") === false) {
			return false;
		} else {
			let token = window.sessionStorage.getItem("token");
			Backbone.ajax({
				method: "PUT",
				url: Utils.getUrl("ventas/up/" + _id),
				dataType: "JSON",
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				data: entity.toJSON(),
				beforeSend: (xhr) => {
					xhr.setRequestHeader("Authentication", token);
				}
			})
				.done(function (res) {
					if (res.success == true) {
						alert("Ok la venta se completo con éxito");
						scope.model.router.navigate("home/" + cedula, { trigger: true, replace: true });
						scope.remove();
					} else {
						alert("Error no esposible el registro " + res.msj);
					}
				})
				.fail(function (err) {
					let error;
					if (err.status == 0) {
						error = err.statusText + ", no hay respuesta del servidor.";
					} else {
						error = err.responseText;
					}
					alert("Error, en la autenticación del usuario \n" + error);
				})
				.always(() => {});
		}
	}
});

export default ViewVentaEdita;
