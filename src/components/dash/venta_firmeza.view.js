import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

const ViewVentaFirmeza = Backbone.View.extend({
	initialize: function () {
		this.model.on("change", this.render);
	},
	tagName: "tr",
	render: function () {
		let template = _.template(document.getElementById("tmp_rows_venta_firmeza").innerHTML);
		$(this.$el).html(template(this.model.toJSON()));
		return this;
	}
});

export default ViewVentaFirmeza;
