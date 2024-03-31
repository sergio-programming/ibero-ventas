const mongoose = require("mongoose");
const { Schema } = mongoose;

const VentaSchema = new Schema({
	serial: {
		index: true,
		type: Number,
		minlength: 1,
		unique: true,
		maxlength: 16,
		required: [true, "El serial es un valor requerido"]
	},
	estado: { type: String, required: true, maxlength: 1 },
	fecha: { type: Date, default: Date.now },
	valor: { type: Number },
	detalles: [ 
		{ type: Schema.Types.ObjectId, ref: "VentaDetalle" }
	],
	cliente: { type: Schema.Types.ObjectId, ref: "Cliente" },
	user: { type: Schema.Types.ObjectId, ref: "User" },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Venta", VentaSchema);
