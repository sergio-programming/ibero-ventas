import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";
import Utils from "../../lib/utils";

const ClienteForm = Backbone.View.extend({
	render: function () {
		let template = _.template(document.getElementById("tmp_cliente_create").innerHTML);
		$(this.$el).html();
		return this;
	},
	events: {
		"click #btnRegresar": "regresarAction"
	},
	regresarAction: function (e) {
		e.preventDefault();
		if (window.confirm("Confirma que desea regresar a la lista de ventas") === false) {
			return false;
		} else {
			this.model.router.navigate("home/" + window.sessionStorage.getItem("cedula"), { trigger: true });
			this.remove();
		}
	}
});

const ViewCliente = Backbone.View.extend(
	{
		render: function () {
			let template = _.template(document.getElementById("tmp_cliente_table").innerHTML);
			$(this.$el).html(template({ clientes: this.collection.toJSON() }));
			return this;
		},
		events: {
			"click #btnRegresar": "regresarAction"
		},
		regresarAction: function (e) {
			e.preventDefault();
			if (window.confirm("Confirma que desea regresar a la lista de ventas") === false) {
				return false;
			} else {
				this.model.router.navigate("home/" + window.sessionStorage.getItem("cedula"), { trigger: true });
				this.remove();
			}
		}
	},
	{
		loadClientes: function (token, callback = void 0) {
			Backbone.ajax({
				type: "GET",
				url: Utils.getUrl("clientes"),
				dataType: "JSON",
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				beforeSend: (xhr) => {
					xhr.setRequestHeader("Authentication", token);
				}
			})
				.done((res) => {
					if (res.success == true) {
						callback(res.collection);
					}
				})
				.fail((err) => {
					let error;
					if (err.status == 0) {
						error = err.statusText + ", no hay respuesta del servidor.";
					} else {
						error = err.responseText;
					}
					alert("Error, detectado en el servidor \n" + error);
					callback(null);
				});
		}
	}
);

export default ViewCliente;
