import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";
import Utils from "../../lib/utils";
import ViewVentaFirmeza from "./venta_firmeza.view";
import moment from "moment";

const ViewHome = Backbone.View.extend(
	{
		render: function () {
			let template = _.template(document.getElementById("tmp_venta_table").innerHTML);
			$(this.$el).html(
				template({
					cedula: window.sessionStorage.getItem("cedula"),
					username: window.sessionStorage.getItem("username"),
					email: window.sessionStorage.getItem("email"),
					avatar: window.sessionStorage.getItem("avatar")
				})
			);
			ViewHome.renderList(this.collection);
			return this;
		},
		events: {
			"click #btnClose": "closeAction",
			"click #btnPerfil": "perfilAction",
			"click [data-toggle='showDetalle']": "detalleAction",
			"click [data-toggle='editDetalle']": "editAction",
			"click [data-toggle='trashDetalle']": "trashAction",
			"click #btnPlus": "createAction"
		},
		closeAction: function (e) {
			e.preventDefault();
			if (window.confirm("Confirma que desea cerrar la sesión del usuario") === false) {
				return false;
			} else {
				window.sessionStorage.setItem("token", null);
				window.sessionStorage.setItem("cedula", null);
				window.sessionStorage.setItem("username", null);
				window.sessionStorage.setItem("email", null);
				window.sessionStorage.setItem("avatar", null);

				this.model.router.navigate("login", { trigger: true, replace: true });
				this.remove();
			}
		},
		perfilAction: function (e) {
			e.preventDefault();
			this.model.router.navigate("perfil/" + window.sessionStorage.getItem("cedula"), { trigger: true });
			this.remove();
		},
		detalleAction: function (e) {
			e.preventDefault();
			let _id = $(e.currentTarget).attr("data-id");
			this.model.router.navigate("show_venta/" + window.sessionStorage.getItem("cedula") + "/" + _id, { trigger: true });
			this.remove();
		},
		editAction: function (e) {
			e.preventDefault();
			if (window.confirm("Confirma que desea editar el registro") === false) {
				return false;
			} else {
				let _id = $(e.currentTarget).attr("data-id");
				this.model.router.navigate("edita_venta/" + window.sessionStorage.getItem("cedula") + "/" + _id, { trigger: true });
				this.remove();
			}
		},
		trashAction: function (e) {
			e.preventDefault();
			if (window.confirm("Confirma que desea borrar el registro") === false) {
				return false;
			} else {
				let scope = this;
				let _id = $(e.currentTarget).attr("data-id");
				let entity = this.collection.get(_id);

				if (window.confirm("Confirma que los datos son correctos para continuar") === false) {
					return false;
				} else {
					let token = window.sessionStorage.getItem("token");
					Backbone.ajax({
						method: "DELETE",
						url: Utils.getUrl("ventas/remove/" + _id),
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
								ViewHome.rowsViews[entity.cid].remove();
								scope.collection.remove(_id);
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
		},
		createAction: function (e) {
			e.preventDefault();
			this.model.router.navigate("crear_venta/" + window.sessionStorage.getItem("cedula"), { trigger: true });
			this.remove();
		}
	},
	{
		rowsViews: [],
		buscarListaVentas: (token, callback = void 0) => {
			Backbone.ajax({
				type: "GET",
				url: Utils.getUrl("ventas/all"),
				dataType: "JSON",
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
		},
		renderList: (collection) => {
			let el = document.getElementById("showRowsTable");
			if (collection.length > 0) {
				collection.forEach(function (model) {
					model.set("fecha", moment(model.get("fecha")).format("YYYY-MM-DD"));
					let view = new ViewVentaFirmeza({ model: model, tagName: "tr" });
					ViewHome.rowsViews[model.cid] = view;
					el.appendChild(view.render().el);
				});
			} else {
				$(el).html("<tr><td colspan='7'>No se dispone de registros a mostrar...</td></tr>");
			}
		}
	}
);

export default ViewHome;
