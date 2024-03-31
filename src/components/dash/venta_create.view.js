import $ from "jquery";
import Backbone from "backbone";
import Qs from "qs";
import _ from "underscore";
import Utils from "../../lib/utils";
import NesteTab from "../../lib/nestedTab";
import _categoria from "../../models/categoria.model";
import _producto from "../../models/producto.model";
import _venfir from "../../models/venta_firmeza.model";
import moment from "moment";
import eventosDom from "../../lib/eventosDom";

const VentaCreate = Backbone.View.extend(
	{
		initialize: function () {
			console.log("Lista productos");
			this.listenTo(this.collection, "add", this.render);
		},
		render: function () {
			VentaCreate.detalleProductos = this.collection;
			let template = _.template(document.getElementById("tmp_venta_create").innerHTML);
			$(this.$el).html(
				template({
					venta: this.model.toJSON(),
					detalles: VentaCreate.detalleProductos.toJSON(),
					cedula: window.sessionStorage.getItem("cedula"),
					avatar: window.sessionStorage.getItem("avatar")
				})
			);
			eventosDom();
			return this;
		}
	},
	{
		detalleProductos: null
	}
);

const ListaCategorias = Backbone.View.extend({
	initialize: () => {
		console.log("Lista categorias");
	},
	render: function () {
		let content = document.createElement("div");
		content.setAttribute("class", "container-list");
		let template = _.template(document.getElementById("tmp_lista_categorias").innerHTML);
		let el = $(this.$el);
		this.collection.forEach((row) => {
			const li = template(row.toJSON());
			$(content).append(li);
		});
		el.html(content);
		return this;
	}
});

const ListaProductos = Backbone.View.extend(
	{
		initialize: function () {
			console.log("Lista productos");
			this.listenTo(this.model, "change", this.render);
		},
		render: function () {
			let template = _.template(document.getElementById("tmp_lista_productos").innerHTML);
			const el = $(this.$el);
			ListaProductos.modelo = this.model;
			let productos = this.collection.toJSON();

			if (_.isNull(ListaProductos.hasFilter) == false) {
				productos = _.where(productos, { categoria: ListaProductos.modelo.get("_id") });
			}
			el.html(
				template({
					categoria: ListaProductos.modelo.toJSON(),
					productos: productos
				})
			);
			return this;
		}
	},
	{
		hasFilter: null,
		modelo: null
	}
);

const ViewVentaCreate = Backbone.View.extend(
	{
		render: function () {
			let template = _.template(document.getElementById("tmp_tabs_content").innerHTML);
			const tabs = [
				{ current: "tab1", name: "categoria", label: "Categorias", disabled: false },
				{ current: "tab2", name: "productos", label: "Productos", disabled: false },
				{ current: "tab3", name: "pedido", label: "Orden De Venta", disabled: true }
			];
			$(this.$el).html(
				template({
					title: "Crear Venta",
					cedula: window.sessionStorage.getItem("cedula"),
					avatar: window.sessionStorage.getItem("avatar"),
					tabs: tabs
				})
			);
			NesteTab("ul.tabs", "active", "#tab1");

			ViewVentaCreate.detalleFirmes = new _venfir.DetalleFirmes();
			ViewVentaCreate.ventaFirme = new _venfir.VentaFirme({
				venta: 1,
				fecha: moment().format("YYYY-MM-DD"),
				user: window.sessionStorage.getItem("cedula"),
				estado: "P",
				cliente_cedula: 0,
				cliente_nombre: "",
				cliente_apellido: "",
				detalles: [],
				valor: 0
			});

			new VentaCreate({
				el: "#tab3",
				model: ViewVentaCreate.ventaFirme,
				collection: ViewVentaCreate.detalleFirmes
			}).render().el;

			ViewVentaCreate.loadCategorias(function (categorias) {
				ViewVentaCreate.categorias = new _categoria.Categorias(categorias);
				new ListaCategorias({ el: "#tab1", collection: ViewVentaCreate.categorias }).render().el;
			});

			ViewVentaCreate.loadProductos(function (productos) {
				ViewVentaCreate.productos = new _producto.Productos(productos);
				const modelo = new _categoria.Categoria();
				new ListaProductos({ el: "#tab2", collection: ViewVentaCreate.productos, model: modelo }).render().el;
			});

			return this;
		},
		events: {
			"click a[toggle-event='clean']": "cleanAction",
			"click #btnRegresar": "regresarAction",
			"click a[toggle-event='selected']": "categoriAction",
			"click a[toggle-event='producto']": "addProductAction",
			"click #btnEnviar": "sendAction",
			"change [toggle-detalles='productos']": "cambioValorAction"
		},
		cleanAction: (e) => {
			e.preventDefault();
			ListaProductos.hasFilter = null;
			const model = new _categoria.Categoria();
			ListaProductos.modelo.set(model.toJSON());
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
		categoriAction: function (e) {
			e.preventDefault();
			ListaProductos.hasFilter = true;
			const _id = $(e.currentTarget).attr("data-id");
			const model = ViewVentaCreate.categorias.get(_id);
			ListaProductos.modelo.set(model.toJSON());
			$('[data-name="productos"]').trigger("click");
		},
		addProductAction: function (e) {
			e.preventDefault();
			const _id = $(e.currentTarget).attr("data-id");
			const model = ViewVentaCreate.productos.get(_id);
			VentaCreate.detalleProductos.add({
				producto: model.get("_id"),
				nombre: model.get("detalle"),
				photo: model.get("photo"),
				cantidad: 1,
				valor: model.get("precio"),
				precio: model.get("precio")
			});
			$('[data-name="pedido"]').removeClass("disabled");
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
			let total = 0;
			document.querySelectorAll("[toggle-detalles='productos']").forEach(function (element) {
				const target = $(element);
				const model = ViewVentaCreate.detalleFirmes.get(target.attr("id"));
				model.set("cantidad", target.val());
				let subtotal = parseInt(model.get("cantidad")) * parseInt(model.get("precio"));
				model.set("valor", subtotal);
				total += subtotal;
			});

			let entity = ViewVentaCreate.ventaFirme.clone();
			entity.set(token);
			entity.set({ valor: total });
			entity.set({ detalles: ViewVentaCreate.detalleFirmes.toJSON() });

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
					method: "POST",
					url: Utils.getUrl("ventas/api_create"),
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
		},
		cambioValorAction: function (e) {
			e.preventDefault();
			let total = 0;
			document.querySelectorAll("[toggle-detalles='productos']").forEach(function (element) {
				const target = $(element);
				const model = ViewVentaCreate.detalleFirmes.get(target.attr("id"));
				model.set("cantidad", target.val());
				let subtotal = parseInt(model.get("cantidad")) * parseInt(model.get("precio"));
				model.set("valor", subtotal);
				total += subtotal;
			});
			$("[name='valor']").val(total);
		}
	},
	{
		categorias: {},
		productos: {},
		detalleFirmes: null,
		ventaFirme: null,
		loadCategorias: (callback = void 0) => {
			let token = window.sessionStorage.getItem("token");
			Backbone.ajax({
				type: "GET",
				url: Utils.getUrl("categorias"),
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
		},
		loadProductos: (callback = void 0) => {
			let token = window.sessionStorage.getItem("token");
			Backbone.ajax({
				type: "GET",
				url: Utils.getUrl("productos"),
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

export default ViewVentaCreate;
