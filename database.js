const mongoose = require("mongoose");
const { mongoURI } = require("./bin/config");
const Secuencia = require('./models/secuncia'); 

mongoose
	.connect(mongoURI)
	.then((db) => console.log("Db is connected"))
	.catch((error) => console.error(error));

mongoose.connection.once('connected', async () => {
	const secuencias =  await Secuencia.find();
	if(secuencias.length == 0){
		const crearSecuencia = new Secuencia({
			conse: 1,
			detalle:'Primer registro de usuarios',
			entity:'user'
		});
		await crearSecuencia.save();
		console.log("Secuencia iniciada");
	}
});

module.exports = mongoose;

