const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductoSchema = new Schema({
	serial: {
		index: true,
		type: Number,
		minlength: 1,
		unique: true,
		maxlength: 16,
		required: [true, "El serial es un valor requerido"]
	},
	detalle: { type: String, required: true, maxlength: 80 },
	stock: { type: Number, required: true, minlength: 0, maxlength: 12 },
	photo: { type: String, required: false, maxlength: 80 },
	categoria: { type: Schema.Types.ObjectId, ref: "Categoria" },
	precio: { type: Number, required: true, minlength: 1, maxlength: 12 }
});

module.exports = mongoose.model("Producto", ProductoSchema);