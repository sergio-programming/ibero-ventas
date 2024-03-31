import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";
import Utils from "../../lib/utils";
import moment from "moment";

const ViewVentaShow = Backbone.View.extend({
	render: function () {
		let template = _.template(document.getElementById("tmp_venta_show").innerHTML);
		this.model.entity.set("fecha", moment(this.model.entity.get("fecha")).format("YYYY-MM-DD"));
		this.model.entity.set("cedula", window.sessionStorage.getItem("cedula"));
		this.model.entity.set("avatar", window.sessionStorage.getItem("avatar"));
		console.log(this.model.entity.toJSON());

		$(this.$el).html(template(this.model.entity.toJSON()));
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

export default ViewVentaShow;
