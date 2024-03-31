const Cliente = require("../models/cliente");

const _clientes = [
	{
		cedula: 1110491952,
		nombres: "Edwin Andres",
		apellidos: "Legro Agudelo"
	},
	{
		cedula: 1110491953,
		nombres: "Alan Felipe ",
		apellidos: "Paez Herrera"
	},
	{
		cedula: 1110491954,
		nombres: "Ricardo Andres",
		apellidos: "Velez Corredor"
	}
];

const Seeder = async function () {
	let ai = 0;
	while (ai < _clientes.length) {
		let cliente = _clientes[ai];
		const entity = new Cliente(cliente);
		await entity.save();
		ai++;
	}
	return await Cliente.find();
};

module.exports = { Seeder: Seeder };
