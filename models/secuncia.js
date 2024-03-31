const mongoose = require("mongoose");
const { Schema } = mongoose;

const SecuenciaSchema = new Schema({
	conse: { type: Number, required: true },
	detalle: { type: String, required: true, maxlength: 80 },
	entity: { type: String, required: true, maxlength: 25, minlength: 3, unique: true }
});

module.exports = mongoose.model("Secuencia", SecuenciaSchema);