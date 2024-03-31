var express = require("express");
var router = express.Router();
const Producto = require("../models/producto");
const ProductoSeeder = require("../seeders/producto_seeder");
const { decodeUserToken } = require("../bin/passport-auth");

router.get("/", decodeUserToken, async function (req, res, next) {
	let collection = await Producto.find();
	res.status(201).json({
		success: true,
		collection: collection
	});
});

router.post("/crear", async function (req, res, next) {
	let collection = await Producto.find();
	if (collection.length == 0) {
		collection = await ProductoSeeder.Seeder();
	}
	res.status(201).json({
		success: true,
		collection: collection
	});
});

router.post("/create", decodeUserToken, async function (req, res, next) {
	try {
		const { detalle, stock, photo, categoria, precio } = req.body;
		const last = await Producto.find().sort({ serial: -1 }).limit(1);

		const entity = new Producto({
			serial: last[0].serial + 1,
			detalle: detalle,
			stock: stock,
			photo: photo,
			categoria: categoria,
			precio: precio
		});

		await entity.save();

		res.status(201).json({
			success: true,
			collection: entity
		});
	} catch (error) {
		res.status(304).json({
			success: false,
			message: error
		});
	}
});

router.put("/up/:id", decodeUserToken, async function (req, res, next) {
	try {
		const { detalle, stock, photo, categoria, precio } = req.body;
		const _id = req.params.id;

		const entity = await Producto.findById(_id);
		entity.stock = stock;
		entity.detalle = detalle;
		entity.photo = photo;
		entity.categoria = categoria;
		entity.precio = precio;
		await entity.save();

		res.status(201).json({
			success: true,
			entity: entity
		});
	} catch (error) {
		res.status(304).json({
			success: false,
			message: error
		});
	}
});

router.delete("/all", async function (req, res, next) {
	let collection = await Producto.find();

	let ai = 0;
	while (ai < collection.length) {
		let producto = collection[ai];
		await Producto.deleteOne(producto);
		ai++;
	}
	let collectionEmpty = await Producto.find();
	res.status(201).json({
		success: true,
		collection: collectionEmpty
	});
});

module.exports = router;
