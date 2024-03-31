const Cliente = require("../models/cliente");
const User = require("../models/user");
const Venta = require("../models/venta");

const _ventas = [
	{
		serial: 1,
		estado: "C",
		fecha: "2023-09-22",
		valor: 20000,
		user: 1110491951,
		cliente: 1110491952
	},
	{
		serial: 2,
		estado: "C",
		fecha: "2023-09-23",
		valor: 22000,
		user: 1110491951,
		cliente: 1110491953
	},
	{
		serial: 3,
		estado: "C",
		fecha: "2023-09-25",
		valor: 10000,
		user: 1110491951,
		cliente: 1110491954
	}
];

const Seeder = async function () {
	let ai = 0;
	while (ai < _ventas.length) {
		let venta = _ventas[ai];
		const clienteEntity = await Cliente.findOne().where("cedula").equals(venta.cliente);
		venta.cliente = clienteEntity._id;

		const userEntity = await User.findOne().where("cedula").equals(venta.user);
		venta.user = userEntity._id;

		const entity = new Venta(venta);
		await entity.save();
		ai++;
	}
	return await Venta.find();
};

module.exports = { Seeder: Seeder };
