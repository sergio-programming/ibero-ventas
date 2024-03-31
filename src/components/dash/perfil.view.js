import $ from "jquery";
import Backbone from "backbone";
import _, { random } from "underscore";

const ViewPerfil = Backbone.View.extend({
	render: function () {
		let template = _.template(document.getElementById("tmp_perfil").innerHTML);

		$(this.$el).html(
			template({
				cedula: window.sessionStorage.getItem("cedula"),
				username: window.sessionStorage.getItem("username"),
				email: window.sessionStorage.getItem("email"),
				avatar: window.sessionStorage.getItem("avatar")
			})
		);
		return this;
	},
	events: {
		"click #btnClose": "closeAction",
		"click #btnWorker": "workerAction"
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
	workerAction: function (e) {
		e.preventDefault();
		this.model.router.navigate("home/" + window.sessionStorage.getItem("cedula"), { trigger: true });
		this.remove();
	}
});

export default ViewPerfil;
