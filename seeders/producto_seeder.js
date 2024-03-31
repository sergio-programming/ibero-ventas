const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const _products = [
	{
		serial: 1,
		detalle: "Cafe con leche",
		stock: 200,
		photo: "pro1.jpg",
		categoria: 4,
		precio: 2000
	},
	{
		serial: 2,
		detalle: "Pan Sandwich",
		stock: 100,
		photo: "pro2.jpg",
		categoria: 5,
		precio: 3000
	},
	{
		serial: 3,
		detalle: "Cafe Capuchino De la Casa",
		stock: 500,
		photo: "pro3.jpg",
		categoria: 4,
		precio: 8000
	},
	{
		serial: 4,
		detalle: "Waffles De Avena",
		stock: 200,
		photo: "pro4.jpg",
		categoria: 2,
		precio: 7000
	},
	{
		serial: 5,
		detalle: "Tamal De la Casa",
		stock: 100,
		photo: "pro5.jpg",
		categoria: 3,
		precio: 8000
	},
	{
		serial: 6,
		detalle: "Gaseosa Cola Cola 350",
		stock: 100,
		photo: "pro6.jpg",
		categoria: 1,
		precio: 2000
	},
	{
		serial: 7,
		detalle: "Gaseosa Manzana Postobon 350",
		stock: 100,
		photo: "pro7.jpg",
		categoria: 1,
		precio: 2000
	}
];

const Seeder = async function () {
	let ai = 0;
	while (ai < _products.length) {
		let producto = _products[ai];
		const categoryEntity = await Categoria.findOne().where("serial").equals(producto.categoria);
		producto.categoria = categoryEntity._id;
		const entity = new Producto(producto);
		await entity.save();
		ai++;
	}
	return await Producto.find();
};

module.exports = { Seeder: Seeder };
