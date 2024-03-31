import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";
import Auth from "../../models/auth.model";
import Utils from "../../lib/utils";

const ViewLogin = Backbone.View.extend({
	initialize: function () {
		console.log("View", "login 2023Elegro");
	},
	render: function () {
		let template = _.template(document.getElementById("tmp_login").innerHTML);
		$(this.$el).html(template());
		return this;
	},
	events: {
		"click #btnEnviar": "sendAction",
		"click #btnRegistrar": "signupAction",
		"click #btnRecuperar": "recoveryUser",
		"click #btnCambioClave": "cambioClave"
	},
	sendAction: function (e) {
		e.preventDefault();
		let scope = this;
		let formData = $("form").serializeArray();
		let token = {};
		_.each(formData, (row, item) => {
			token[row.name] = row.value;
		});
		let entity = new Auth(token);
		if (!entity.isValid()) {
			Auth.renderErrors(entity.validationError);
			return false;
		}
		console.log("entity", entity.toJSON());
		if (window.confirm("Confirma que los datos son correctos para continuar") === false) {
			return false;
		} else {
			Backbone.emulateJSON = true;
			Backbone.ajax({
				method: "POST",
				url: Utils.getUrl("login"),
				dataType: "JSON",
				data: entity.toJSON()
			})
				.done((res) => {
					if (res.success == true) {
						alert("Ok la cuenta es correcta para continuar");
						let item = Math.floor(Math.random() * 4) + 1;
						window.sessionStorage.setItem("token", res.token);
						window.sessionStorage.setItem("cedula", res.entity.cedula);
						window.sessionStorage.setItem("username", res.entity.nombres + " " + res.entity.apellidos);
						window.sessionStorage.setItem("email", res.entity.email);
						window.sessionStorage.setItem("avatar", "avatar" + item + ".png");

						scope.model.router.navigate("perfil/" + res.entity.cedula, { trigger: true, replace: true });
						scope.remove();
					}
				})
				.fail((err) => {
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
	signupAction: function (e) {
		e.preventDefault();
		console.log("signup");
		this.model.router.navigate("signup", { trigger: true });
		this.remove();
	},
	recoveryUser: function (e) {
		e.preventDefault();
		console.log("recoveryuser");
		this.model.router.navigate("recoveryuser", { trigger: true });
		this.remove();
	},
	cambioClave: function (e) {
		e.preventDefault();
		console.log("changepass");
		this.model.router.navigate("changepass", { trigger: true });
		this.remove();
	}
});

export default ViewLogin;
