const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategoriaSchema = new Schema({
	serial: {
		index: true,
		type: Number,
		minlength: 1,
		unique: true,
		maxlength: 16,
		required: [true, "El serial es un valor requerido"]
	},
	detalle: { type: String, required: true, maxlength: 80 },
	photo: { type: String, required: false, maxlength: 80 },
	tipo: { type: String, required: true, maxlength: 1 },
	estado: { type: String, required: true, maxlength: 1 },
	productos: [{ type: Schema.Types.ObjectId, ref: "Producto" }]
});

CategoriaSchema.static("tipoTupla", async function () {
	return {'S':'SOLIDOS', 'B':'BEBIDAS'};
});

module.exports = mongoose.model("Categoria", CategoriaSchema);
