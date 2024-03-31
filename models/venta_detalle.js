const mongoose = require("mongoose");
const { Schema } = mongoose;

const VentaDetalleSchema = new Schema({
	venta: { type: Schema.Types.ObjectId, ref: "Venta" },
	producto: { type: Schema.Types.ObjectId, ref: "Producto" },
	cantidad: { type: Number },
	subtotal: { type: Number }
});

module.exports = mongoose.model("VentaDetalle", VentaDetalleSchema);
