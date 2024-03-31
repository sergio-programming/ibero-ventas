import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";
import Utils from "../../lib/utils";

const ViewRecovery = Backbone.View.extend({
	render: function () {
		let template = _.template(document.getElementById("tmp_recovery_user").innerHTML);
		$(this.$el).html(template());
		return this;
	},
	events: {
		"click #btnEnviar": "sendAction",
		"click #btnRegistrar": "signupAction",
		"click #btnCambioClave": "cambioClave",
		"click #btnLogin": "loginAction"
	},
	sendAction: function (e) {
		e.preventDefault();
		let scope = this;
		let formData = $("form").serializeArray();
		let token = {};
		_.each(formData, (row, item) => {
			token[row.name] = row.value;
		});

		if (window.confirm("Confirma que los datos son correctos para continuar") === false) {
			return false;
		} else {
			Backbone.emulateJSON = true;
			Backbone.ajax({
				method: "POST",
				url: Utils.getUrl("recovery"),
				dataType: "JSON",
				data: token
			})
				.done((res) => {
					if (res.success == true) {
						alert(`La cuenta se ha recuperado de forma correcta la nueva clave es: \n${res.clave}`);
						scope.model.router.navigate("login", { trigger: true, replace: true });
						scope.remove();
					} else {
						alert(`Error: \n${res.error}`);
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
	loginAction: function (e) {
		e.preventDefault();
		console.log("signup");
		this.model.router.navigate("login", { trigger: true });
		this.remove();
	},
	cambioClave: function (e) {
		e.preventDefault();
		console.log("changepass");
		this.model.router.navigate("changepass", { trigger: true });
		this.remove();
	}
});

export default ViewRecovery;
