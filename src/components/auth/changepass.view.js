import Backbone from "backbone";
import $ from "jquery";
import _ from "underscore";
import Utils from "../../lib/utils";

const ViewChangePass = Backbone.View.extend({
	render: function () {
		let template = _.template(document.getElementById("tmp_change_pass").innerHTML);
		$(this.$el).html(template());
		return this;
	},
	events: {
		"click #btnEnviar": "sendAction",
		"click #btnRegistrar": "signupAction",
		"click #btnRecuperar": "recoveryUser",
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
				url: Utils.getUrl("changepass"), 
				dataType: "JSON",
				data: token
			})
				.done((res) => {
					if (res.success == true) {
						alert(`Ok, has cambiado la clave de forma correcta`);
						scope.model.router.navigate("login", { trigger: true, replace: true });
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
				});
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
	loginAction: function (e) {
		e.preventDefault();
		console.log("signup");
		this.model.router.navigate("login", { trigger: true });
		this.remove();
	}
});

export default ViewChangePass;
