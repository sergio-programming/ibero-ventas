const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const favicon = require("serve-favicon");
const cors = require("cors");
const mongoose = require("./database");
const config = require("./bin/config");
const es6 = require("express-es6-template-engine");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const productosRouter = require("./routes/productos");
const pruebasRouter = require("./routes/pruebas");
const ventasRouter = require("./routes/ventas");
const categoriaRouter = require("./routes/categorias");
const clienteRouter = require("./routes/clientes");

const app = express();

// view engine setup
app.engine("html", es6);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use(logger("dev"));
app.use(express.json());
/* app.use(express.urlencoded({ extended: false }));  no usar para api-rest*/
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compress());
app.options("*", cors());
app.use(cors(config.corsOpt));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/ventas", ventasRouter);
app.use("/categorias", categoriaRouter);
app.use("/productos", productosRouter);
app.use("/clientes", clienteRouter);

/*	
app.use("/products", productsRouter);
app.use("/pruebas", pruebasRouter);
*/

app.use(function (req, res, next) {
	return next(createError(404, "La pagina no está disponible."));
});

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render("error", {
		locals: {
			message: err.message,
			error: req.app.get("env") === "development" ? err : {}
		}
	});
});

app.use(function (request, response, next) {
	Promise.resolve(mongoose).then((connection, err) => (typeof connection !== "undefined" ? next() : next(new Error("MongoError"))));
});

module.exports = app;
