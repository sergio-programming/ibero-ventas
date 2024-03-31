const { jwtOpt } = require("./config");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {
	validaToken: (req, res, next) => {
		try {
			if (!req.headers.authentication) {
				return res.status(403).send({ message: "Tu petición no tiene cabecera de autorización" });
			}
			const token = req.headers.authentication.split(" ")[1];
			jwt.verify(token, jwtOpt.secretOrKey, async (err, decoded) => {
				if (err) {
					let error = {
						success: false,
						message: "El token ha expirado",
						error: err
					};
					return res.status(403).send(error);
				}
				req.decoded = decoded;
				next();
			});

		} catch (e) {
			let err = {
				success: false,
				message: "Error validation token",
				error: e
			};
			return res.status(403).send(err);
		}
	},
	decodeUserToken: async (req, res, next)  => {
		try {
			if (!req.headers.authentication) {
				return res.status(403).send({ message: "Tu petición no tiene cabecera de autorización" });
			}
			const token = req.headers.authentication.split(" ")[1];

			const decoded = jwt.verify(token, jwtOpt.secretOrKey);
			if (decoded === undefined || decoded === '') {
				let error = {
					success: false,
					message: "El token ha expirado",
					error: decoded
				};
				return res.status(403).send(error);
			}

			const user = await User.findOne().where("token").equals(token);
				
			if (!user) {
				let err = {
					success: false,
					message: "Token user ya no es valido para el usuario",
					decoded: decoded
				};
				return res.status(403).send(err);
			}

			console.log("Login user successfull");
			req.user = await user.fillable();
			next();

		} catch (e) {
			let err = {
				success: false,
				message: "Error validation token user",
				error: e
			};
			return res.status(403).send(err);
		}
	},
	isAuthToken: (req, res, next) => {
		if (!req.headers.authentication) {
			return res.status(403).send({ success: false, message: "Tu petición no tiene cabecera de autorización" });
		} else {
			const token = req.headers.authentication.split(" ")[1];

			jwt.verify(token, jwtOpt.secretOrKey, (err, decoded) => {
				if (err) {
					let error = {
						success: false,
						message: "El token ha expirado",
						error: err
					};
					return res.status(403).send(error);
				} else {
					console.log("Ok la validación de token");
					next();
				}
			});
		}
	}
};