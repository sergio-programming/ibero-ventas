var express = require("express");
var router = express.Router();
const Categoria = require("../models/categoria");
const CategoriaSeeder = require("../seeders/categoria_seeder");
const { decodeUserToken } = require("../bin/passport-auth");

router.get("/", decodeUserToken, async function (req, res, next) {
	let collectionCategorias = await Categoria.find();
	res.status(201).json({
		success: true,
		collection: collectionCategorias
	});
});

router.post("/crear", async function (req, res, next) {
	let collectionCategorias = await Categoria.find();
	if (collectionCategorias.length == 0) {
		collectionCategorias = await CategoriaSeeder.Seeder();
	}
	res.status(201).json({
		success: true,
		collection: collectionCategorias
	});
});

router.post("/create", decodeUserToken, async function (req, res, next) {
	try {
		const { detalle, photo, tipo, estado } = req.body;
		const last = await Categoria.find().sort({ serial: -1 }).limit(1);

		const entity = new Categoria({
			serial: last[0].serial + 1,
			detalle: detalle,
			photo: photo,
			tipo: tipo,
			estado: estado
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
		const { detalle, photo, tipo, estado } = req.body;
		const _id = req.params.id;

		const entity = await Categoria.findById(_id);
		entity.detalle = detalle;
		entity.photo = photo;
		entity.tipo = tipo;
		entity.estado = estado;
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
	let collectionCategorias = await Categoria.find();

	let ai = 0;
	while (ai < collectionCategorias.length) {
		let _categoria = collectionCategorias[ai];
		await Categoria.deleteOne(_categoria);
		ai++;
	}

	let collectionEmpty = await Categoria.find();
	res.status(201).json({
		success: true,
		collection: collectionEmpty
	});
});

module.exports = router;
