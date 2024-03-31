const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { jwtOpt } = require("../bin/config");

//User model
const User = require("../models/user");
const { isAuthToken } = require("../bin/passport-auth");

router.get("/", async function (req, res, next) {
	res.render("index", {
		locals: {
			title: "Welcome Express!"
		}
	});
});

router.get("/auth", async function (req, res, next) {
	res.render("index", {
		locals: {
			title: "Welcome Express!"
		}
	});
});

router.post("/login", async function (req, res, next) {
	try {
		const { body } = req;
		const { cedula, clave } = body;

		const user = await User.login(cedula, clave);
		if (user) {
			const payload = {
				cedula: user.cedula,
				mail: user.email,
				user: user.nombres + " " + user.apellidos
			};

			jwt.sign(payload, jwtOpt.secretOrKey, { expiresIn: jwtOpt.expiresIn }, (err, token) => {
				user.token = token;
				user.save();

				res.status(200).json({
					success: true,
					entity: {
						cedula: user.cedula,
						nombres: user.nombres,
						apellidos: user.apellidos,
						email: user.email,
						celular: user.celular
					},
					token: jwtOpt.type + " " + token
				});
			});
		} else {
			res.status(203).json({ success: false, error: "Usuario no existe en la base" });
		}
	} catch (error) {
		res.status(403).json({ success: false, error: error.message });
	}
});

router.post("/logout", isAuthToken, async function (req, res) {
	const { body } = req;
	const { cedula } = body;
	const user = await User.findById(cedula);
	user.token = null;
	user.save();
	res.status(200).send({ success: true, status: "Bye bye!" });
});

router.post("/signup", async (req, res) => {
	try {
		const { body } = req;
		const { cedula, clave } = body;
		const user = await User.signup(cedula, clave, body);
		if (user) {
			const payload = {
				cedula: user.cedula,
				mail: user.email,
				user: user.nombres + " " + user.apellidos
			};
			jwt.sign(payload, jwtOpt.secretOrKey, { expiresIn: jwtOpt.expiresIn }, (err, token) => {
				user.token = token;
				user.save();
				res.status(201).json({
					success: true,
					entity: {
						cedula: user.cedula,
						nombres: user.nombres,
						apellidos: user.apellidos,
						email: user.email,
						celular: user.celular
					},
					token: jwtOpt.type + " " + token
				});
			});
		} else {
			res.status(203).json({ success: false, error: "Error en el registro de usuario" });
		}
	} catch (error) {
		res.status(403).json({ success: false, error: error.message });
	}
});

router.get("/profile", isAuthToken, (req, res) => {
	res.status(200).json({ success: true, msj: "Token Valid OK", entity: req.user });
});

router.post("/changepass", async (req, res) => {
	try {
		const { body } = req;
		const { cedula, clave_old, clave_new } = body;
		const user = await User.login(cedula, clave_old);
		if (user) {
			await user.changePass(clave_new);
			res.status(201).json({ success: true, status: "Clave changed" });
		} else {
			res.status(203).json({ success: false, error: "No son validas las credenciales de usuario." });
		}
	} catch (error) {
		res.status(403).json({ success: false, error: error.message });
	}
});

router.post("/recovery", async (req, res) => {
	try {
		const { body } = req;
		const { cedula, email } = body;
		const user = await User.findOne().where("cedula").equals(cedula).where("email").equals(email);
		if (user) {
			const change = await user.createPasswors();
			if (change) {
				res.status(201).json({ success: true, status: "Clave changed", clave: change.clave });
			} else {
				res.status(203).json({ success: false, error: "La recuperación de la cuenta no es posible" });
			}
		} else {
			res.status(203).json({ success: false, error: "El usuario no es valido para recuperar los datos" });
		}
	} catch (error) {
		res.status(403).json({ success: false, error: error.message });
	}
});

module.exports = router;
