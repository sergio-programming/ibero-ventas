module.exports = {
	port: (val) => {
		var port = parseInt(val, 10);
		if (isNaN(port)) {
			return val;
		}
		if (port >= 0) {
			return port;
		}
		return false;
	},
	mongoURI: "mongodb://127.0.0.1:27017/iberoVentas",
	jwtOpt: {
		secretOrKey: "io898hhnioksn%682++*...9$",
		expiresIn: 1000,
		type: "Bearer",
		issuer: "iberoVentas.com.co",
		audience: "ibero.net"
	},
	corsOpt: {
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Authentication"],
		exposedHeaders: ["HTTP_X_REQUESTED_WITH", "XMLHttpRequest", "Authentication"]
	},
	loadHeaders: (req, res, next) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
		res.setHeader("Access-Control-Allow-Headers", "Authentication,X-Requested-With,Content-Type,HTTP_X_REQUESTED_WITH,Accept");
		res.setHeader("Access-Control-Allow-Credentials", true);
		next();
	}
};
