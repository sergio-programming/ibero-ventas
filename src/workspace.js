import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import ViewLogin from "./components/auth/login.view";
import ViewSignup from "./components/auth/signup.view";
import ViewChangepass from "./components/auth/changepass.view";
import ViewRecoveryUser from "./components/auth/recovery_user.view";
import ViewHome from "./components/dash/home.view";
import ViewCliente from "./components/clientes/clientes.view";
import ViewProducto from "./components/productos/productos.view";
import ViewPerfil from "./components/dash/perfil.view";
import _venta from "./models/venta.model";
import _cliente from "./models/cliente.model";
import _categoria from "./models/categoria.model";
import _producto from "./models/producto.model";
import Utils from "./lib/utils";
import ViewVentaCreate from "./components/dash/venta_create.view";
import ViewVentaShow from "./components/dash/venta_show.view";
import ViewVentaEdita from "./components/dash/venta_edita.view";
import NesteTab from "./lib/nestedTab";
import eventosDom from "./lib/eventosDom";
import ViewCategoria from "./components/categorias/categorias.view";

var Workspace = Backbone.Router.extend(
	{
		initialize: () => {
			Workspace.createContainer();
		},
		routes: {
			login: "login",
			signup: "signup",
			changepass: "changepass",
			recoveryuser: "recoveryUser",
			"home/:cedula": "home",
			"perfil/:cedula": "perfil",
			"crear_venta/:cedula": "crearVenta",
			"edita_venta/:cedula/:id": "editaVenta",
			"show_venta/:cedula/:id": "showVenta",
			"search/:query/p:page": "search",
			tabs: "tabsView",
			"clientes/:cedula": "routeClientes",
			"productos/:cedula": "routeProductos",
			"categorias/:cedula": "routeCategorias"
		},
		login: () => {
			Workspace.createContainer();
			let model = { router: Workspace.router };
			let views = new ViewLogin({ el: "#contentApp", model: model });
			Workspace.ViewActive = views.render().el;
			Workspace.posRenderForm();
			eventosDom();
		},
		signup: () => {
			Workspace.createContainer();
			let model = { router: Workspace.router };
			let view = new ViewSignup({ el: "#contentApp", model: model });
			Workspace.ViewActive = view.render().el;
			Workspace.posRenderForm();
			eventosDom();
		},
		changepass: () => {
			Workspace.createContainer();
			let model = { router: Workspace.router };
			let view = new ViewChangepass({ el: "#contentApp", model: model });
			Workspace.ViewActive = view.render().el;
			Workspace.posRenderForm();
			eventosDom();
		},
		recoveryUser: () => {
			Workspace.createContainer();
			let model = { router: Workspace.router };
			let view = new ViewRecoveryUser({ el: "#contentApp", model: model });
			Workspace.ViewActive = view.render().el;
			Workspace.posRenderForm();
			eventosDom();
		},
		perfil: (cedula) => {
			if (_.isNull(cedula) || _.isUndefined(cedula)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			let token = window.sessionStorage.getItem("token");
			if (_.isNull(token) || _.isUndefined(token)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}

			Workspace.validaAuthToken(token, (result) => {
				if (_.isNull(result)) {
					alert("La session ha finalizado");
					Workspace.router.navigate("login", { trigger: true, replace: true });
					return null;
				} else {
					Workspace.createContainer();
					let model = { router: Workspace.router };
					let view = new ViewPerfil({ el: "#contentApp", model: model });
					Workspace.ViewActive = view.render().el;
					Workspace.posRenderForm();
				}
			});
		},
		home: (cedula) => {
			if (_.isNull(cedula) || _.isUndefined(cedula)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			let token = window.sessionStorage.getItem("token");
			if (_.isNull(token) || _.isUndefined(token)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			Workspace.contentTabs(cedula);
			Workspace.validaAuthToken(token, (result) => {
				if (_.isNull(result)) {
					alert("La session ha finalizado");
					Workspace.router.navigate("login", { trigger: true, replace: true });
					return null;
				} else {
					ViewHome.buscarListaVentas(token, (collection) => {
						if (_.isNull(collection)) {
							alert("La session ha finalizado");
							Workspace.router.navigate("login", { trigger: true, replace: true });
							return null;
						} else {
							Workspace.createSubContainer("tab__home", "home");
							let model = { router: Workspace.router };
							let ventas_collection = new _venta.Ventas();
							ventas_collection.add(collection, { merge: true });
							let view = new ViewHome({ el: "#content_sub_home", model: model, collection: ventas_collection });
							Workspace.ViewActive = view.render().el;
							Workspace.posRenderForm();
							eventosDom();
						}
					});
				}
			});
		},
		search: (query, page) => {
			document.getElementById("app").innerHTML = "<h1>Search Option</h1>";
		},
		crearVenta: (cedula) => {
			if (_.isNull(cedula) || _.isUndefined(cedula)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			let token = window.sessionStorage.getItem("token");
			if (_.isNull(token) || _.isUndefined(token)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			Workspace.validaAuthToken(token, (result) => {
				if (_.isNull(result)) {
					alert("La session ha finalizado");
					Workspace.router.navigate("login", { trigger: true, replace: true });
					return null;
				} else {
					Workspace.createContainer();
					let model = { router: Workspace.router };
					let view = new ViewVentaCreate({ el: "#contentApp", model: model });
					Workspace.ViewActive = view.render().el;
					Workspace.posRenderForm();
				}
			});
		},
		editaVenta: (cedula, id) => {
			if (_.isNull(cedula) || _.isUndefined(cedula) || _.isUndefined(id) || _.isNull(id)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			let token = window.sessionStorage.getItem("token");
			if (_.isNull(token) || _.isUndefined(token)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			ViewHome.buscarListaVentas(token, function (collection) {
				if (_.isNull(collection)) {
					alert("La session ha finalizado");
					Workspace.router.navigate("login", { trigger: true, replace: true });
					return null;
				} else {
					Workspace.createContainer();
					let ventasCollection = new _venta.Ventas();
					ventasCollection.add(collection);

					let entity = ventasCollection.get(id);
					console.log(ventasCollection.toJSON());

					let model = { router: Workspace.router, entity: entity };

					let view = new ViewVentaEdita({ el: "#contentApp", model: model });
					Workspace.ViewActive = view.render().el;
				}
			});
		},
		showVenta: (cedula, id) => {
			if (_.isNull(cedula) || _.isUndefined(cedula) || _.isUndefined(id) || _.isNull(id)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			let token = window.sessionStorage.getItem("token");
			if (_.isNull(token) || _.isUndefined(token)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			ViewHome.buscarListaVentas(token, (collection) => {
				if (_.isNull(collection)) {
					alert("La session ha finalizado");
					Workspace.router.navigate("login", { trigger: true, replace: true });
					return null;
				} else {
					Workspace.createContainer();

					let ventas_collection = new _venta.Ventas();
					ventas_collection.add(collection, { merge: true });
					let entity = ventas_collection.get(id);
					let model = { router: Workspace.router, entity: entity };

					let view = new ViewVentaShow({ el: "#contentApp", model: model });
					Workspace.ViewActive = view.render().el;
					Workspace.posRenderForm();
				}
			});
		},
		routeClientes: (cedula) => {
			if (_.isNull(cedula) || _.isUndefined(cedula)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			let token = window.sessionStorage.getItem("token");
			if (_.isNull(token) || _.isUndefined(token)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			Workspace.validaAuthToken(token, (result) => {
				if (_.isNull(result)) {
					alert("La session ha finalizado");
					Workspace.router.navigate("login", { trigger: true, replace: true });
					return null;
				} else {
					ViewCliente.loadClientes(token, function (collection) {
						if (_.isNull(collection)) {
							alert("La session ha finalizado");
							Workspace.router.navigate("login", { trigger: true, replace: true });
							return null;
						} else {
							Workspace.contentTabs(cedula, "#tab2");
							Workspace.createSubContainer("tab__clientes", "clientes");

							let model = { router: Workspace.router };
							let clientes_collection = new _cliente.Clientes();
							clientes_collection.add(collection);
							let view = new ViewCliente({ el: "#content_sub_clientes", model: model, collection: clientes_collection });
							Workspace.ViewActive = view.render().el;
						}
					});
				}
			});
		},
		routeProductos: (cedula) => {
			if (_.isNull(cedula) || _.isUndefined(cedula)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			let token = window.sessionStorage.getItem("token");
			if (_.isNull(token) || _.isUndefined(token)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}

			Workspace.validaAuthToken(token, (result) => {
				if (_.isNull(result)) {
					alert("La session ha finalizado");
					Workspace.router.navigate("login", { trigger: true, replace: true });
					return null;
				} else {
					ViewProducto.loadProductos(token, function (collection) {
						if (_.isNull(collection)) {
							alert("La session ha finalizado");
							Workspace.router.navigate("login", { trigger: true, replace: true });
							return null;
						} else {
							Workspace.contentTabs(cedula, "#tab3");
							Workspace.createSubContainer("tab__productos", "productos");

							let model = { router: Workspace.router };
							let prodcutos_collection = new _producto.Productos();
							prodcutos_collection.add(collection);
							let view = new ViewProducto({ el: "#content_sub_productos", model: model, collection: prodcutos_collection });
							Workspace.ViewActive = view.render().el;
						}
					});
				}
			});
		},
		routeCategorias: (cedula) => {
			if (_.isNull(cedula) || _.isUndefined(cedula)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			let token = window.sessionStorage.getItem("token");
			if (_.isNull(token) || _.isUndefined(token)) {
				Workspace.router.navigate("login", { trigger: true, replace: true });
				return null;
			}
			Workspace.validaAuthToken(token, (result) => {
				if (_.isNull(result)) {
					alert("La session ha finalizado");
					Workspace.router.navigate("login", { trigger: true, replace: true });
					return null;
				} else {
					ViewCategoria.loadCategorias(token, function (collection) {
						if (_.isNull(collection)) {
							alert("La session ha finalizado");
							Workspace.router.navigate("login", { trigger: true, replace: true });
							return null;
						} else {
							Workspace.contentTabs(cedula, "#tab4");
							Workspace.createSubContainer("tab__categorias", "categorias");

							let model = { router: Workspace.router };
							let categorias_collection = new _categoria.Categorias();
							categorias_collection.add(collection);
							let view = new ViewCategoria({ el: "#content_sub_categorias", model: model, collection: categorias_collection });
							Workspace.ViewActive = view.render().el;
						}
					});
				}
			});
		}
	},
	{
		router: void 0,
		ViewActive: void 0,
		createContainer: () => {
			if (Workspace.ViewActive !== void 0) {
				Workspace.ViewActive.remove();
				$("#contentApp").remove();
			}
			const el = document.createElement("div");
			el.setAttribute("id", "contentApp");
			el.setAttribute("class", "contentApp");
			document.getElementById("app").appendChild(el);
		},
		createSubContainer: (element, tab) => {
			const el = document.createElement("div");
			el.setAttribute("id", "content_sub_" + tab);
			el.setAttribute("class", "content_sub_" + tab);
			document.getElementById(element).innerHTML = "";
			document.getElementById(element).appendChild(el);
		},
		posRenderForm: () => {
			$("[data-toggle='decrement']").on("click", function (e) {
				e.preventDefault();
				let el = document.querySelector("[data-toggle='decrement']");
				Workspace.decrementValue(el);
			});

			$("[data-toggle='increment']").on("click", function (e) {
				e.preventDefault();
				let el = document.querySelector("[data-toggle='increment']");
				Workspace.incrementValue(el);
			});
		},
		validaAuthToken: async (token, callback = void 0) => {
			Backbone.ajax({
				type: "GET",
				url: Utils.getUrl("profile"),
				dataType: "JSON",
				beforeSend: (xhr) => {
					xhr.setRequestHeader("Authentication", token);
				}
			})
				.done((res) => {
					if (res.success == true) {
						callback(res.success);
					} else {
						Workspace.closeApp();
						callback(null);
					}
				})
				.fail((err) => {
					let error;
					if (err.status == 0) {
						error = err.statusText + ", no hay respuesta del servidor.";
					} else {
						error = err.responseText;
					}
					console.log("Error", error);
					callback(null);
				});
		},
		closeApp: () => {
			window.sessionStorage.setItem("token", null);
			window.sessionStorage.setItem("cedula", null);
			window.sessionStorage.setItem("username", null);
			window.sessionStorage.setItem("email", null);
			window.sessionStorage.setItem("avatar", null);
		},
		incrementValue: (button) => {
			const input = button.previousElementSibling;
			if (input.value === "") {
				input.value = parseInt(input.min);
			} else if (parseInt(input.value) < parseInt(input.max)) {
				input.value = parseInt(input.value) + 1;
			}
		},
		decrementValue: (button) => {
			const input = button.nextElementSibling;
			if (parseInt(input.value) > parseInt(input.min)) {
				input.value = parseInt(input.value) - 1;
			}
		},
		mostrarNombreArchivo: (input) => {
			let fileName = input.files[0].name;
			let archivoTexto = input.parentNode.querySelector(".text");
			archivoTexto.innerText = `${fileName}`;
			let viewElement = input.parentNode.querySelector(".view");
			viewElement.classList.add("file-select");
		},
		seleccionarArchivo: () => {
			let archivoInput = document.querySelector("#archivo");
			let value = $(archivoInput).val();
			if (value) {
				$(archivoInput).val(null);
				let archivoTexto = archivoInput.parentNode.querySelector(".text");
				$(archivoTexto).text("Añadir archivo");
				let viewElement = archivoInput.parentNode.querySelector(".view");
				viewElement.classList.remove("file-select");
			} else {
				$(archivoInput).trigger("click");
			}
		},
		applyOpenStyle: (selectElement) => {
			if (selectElement.classList.contains("select-open")) {
				selectElement.classList.remove("select-open");
			} else {
				selectElement.classList.add("select-open");
			}
		},
		removeOpenStyle: (selectElement) => {
			selectElement.classList.remove("select-open");
		},
		updateRange: (input) => {
			let minValue = parseInt(input.getAttribute("min"));
			let maxValue = parseInt(input.getAttribute("max"));
			let sliderValue = parseInt(input.value);
			let percentage = ((sliderValue - minValue) / (maxValue - minValue)) * (100 - (24 / input.offsetWidth) * 100);
			input.parentNode.parentNode.querySelector(".num-value").textContent = sliderValue;
			input.parentNode.querySelector(".thumb").style.left = `calc(${percentage}% - 12px)`;
			input.parentNode.querySelector(".progress-bar").style.width = `calc(${percentage}% + 12px)`;
		},
		contentTabs: (cedula, tabActive) => {
			let template = _.template(document.getElementById("tmp_tabs_content").innerHTML);
			$("#contentApp").remove();
			Workspace.createContainer();
			const tabs = [
				{ disabled: false, current: "tab1", name: "home", label: "Ventas" },
				{ disabled: false, current: "tab2", name: "clientes", label: "Clientes" },
				{ disabled: false, current: "tab3", name: "productos", label: "Productos" },
				{ disabled: false, current: "tab4", name: "categorias", label: "Categorias" }
			];
			$("#contentApp").html(template({ title: null, tabs: tabs }));
			NesteTab("ul.tabs", "active", tabActive);

			$("#contentApp").on("click", "a[toggle-event='tab']", (e) => {
				e.preventDefault();
				const route = $(e.currentTarget).attr("data-name");
				Workspace.router.navigate(route + "/" + cedula, { trigger: true });
			});
		}
	}
);

export default Workspace;
