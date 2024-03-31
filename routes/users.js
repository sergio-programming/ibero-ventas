var express = require("express");
var router = express.Router();
const User = require("../models/user");
const { decodeUserToken } = require("../bin/passport-auth");

/* GET users listing. */
router.get("/", decodeUserToken, async function (req, res, next) {
	const collectionUsers = await User.find();
	res.json({
		status: 200,
		data: collectionUsers
	});
});

router.get("/:cedula", decodeUserToken, async function (req, res, next) {
	const entity = await User.findById(req.params.cedula);
	res.json({
		status: 200,
		entity: entity
	});
});

router.post("/", decodeUserToken, async function (req, res, next) {
	const { cedula, nombres, apellidos, email, celular, clave } = req.body;
	const user = new User({ cedula, nombres, apellidos, celular, email, clave });
	const entity = await user.save();

	res.json({
		status: 201,
		data: entity
	});
});

router.put("/:cedula", decodeUserToken, async function (req, res, next) {
	const { cedula, nombres, apellidos, email, celular, clave } = req.body;
	const data = {
		cedula,
		nombres,
		apellidos,
		email,
		celular,
		clave
	};
	const out = await User.findByIdAndUpdate(req.params.cedula, data);
	res.json({
		status: 201,
		data: out
	});
});

router.delete("/user/:cedula", decodeUserToken, async function (req, res, next) {
	const out = await User.deleteOne({ cedula: req.params.cedula });
	res.json({
		status: 201,
		data: out
	});
});

router.delete("/all", decodeUserToken, async function (req, res, next) {
	try {
		const collection = await User.find();
		let ai = 0;
		while (ai < collection.length) {
			let user = collection[ai];
			await User.findByIdAndRemove(user.id);
			ai++;
		}
		let collectionEmpty = await User.find();
		res.json({
			status: 201,
			data: collectionEmpty
		});
	} catch (error) {
		res.json({
			status: 304,
			message: error
		});
	}
});

module.exports = router;
