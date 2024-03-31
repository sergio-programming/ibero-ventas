var express = require("express");
var router = express.Router();
const Cliente = require("../models/cliente");
const ClienteSeeder = require("../seeders/cliente_seeder");
const { decodeUserToken } = require("../bin/passport-auth");

router.get("/", decodeUserToken, async function (req, res, next) {
	const clientes = await Cliente.find();
	res.status(201).json({
		success: true,
		collection: clientes
	});
});

router.post("/crear", async function (req, res, next) {
	let collection = await Cliente.find();
	if (collection.length == 0) {
		collection = await ClienteSeeder.Seeder();
	}
	res.status(201).json({
		success: true,
		collection: collection
	});
});

router.post("/create", decodeUserToken, async function (req, res, next) {
	try {
		const { cedula, nombres, apellidos } = req.body;

		const entity = new Cliente({
			cedula: cedula,
			nombres: nombres,
			apellidos: apellidos
		});

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
	let collection = await Cliente.find();
	let ai = 0;
	while (ai < collection.length) {
		let cliente = collection[ai];
		await Cliente.deleteOne(cliente);
		ai++;
	}
	let collectionEmpty = await Cliente.find();
	res.status(201).json({
		success: true,
		collection: collectionEmpty
	});
});

router.get("/:cliente", async function (req, res, next) {
	const entity = await Cliente.findById(req.params.cliente);
	res.status(200).json({
		success: true,
		entity: entity
	});
});

router.put("/up/:id", decodeUserToken, async function (req, res, next) {
	try {
		const { cedula, nombres, apellidos } = req.body;
		const _id = req.params.id;

		const entity = await Cliente.findById(_id);
		entity.cedula = cedula;
		entity.nombres = nombres;
		entity.apellidos = apellidos;
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

module.exports = router;
