/**
 * Agregue dos métodos de ruta para manejar una solicitud en la misma ruta "/one".
 * Utilice el método de tipo del objeto de respuesta para establecer el tipo de contenido de la
 * respuesta enviada al cliente en texto/sin formato. Utilizando el método de escritura,
 * envíe datos parciales al cliente.
 *
 * Para finalizar el envío de datos, utilice el método de finalización del objeto de respuesta.
 *  Llamar a nextHandler pasará el controlador al segundo controlador de la cadena:
 */

const express = require("express");
const router = express.Router();

/**
 * Usando un middleware para la ruta de pruebas
 */
router.get("/", (request, response, next) => {
	if (request.allowed) {
		response.send("Hello secret world!");
	} else {
		response.send("You are not allowed to enter");
	}
});

router.get("/one", (request, response, nextHandler) => {
	response.type("text/plain");
	response.write("Hello ");
	nextHandler();
});

router.get("/one", (request, response, nextHandler) => {
	response.status(200).end("World!");
});

/**
 * De forma simplificada
 */
router.get(
	"/two",
	(request, response, nextHandler) => {
		response.type("text/plain");
		response.write("Hello ");
		nextHandler();
	},
	(request, response, nextHandler) => {
		response.status(200).end("Moon!");
	}
);

/**
 * usnado expresion regular para la entrada por defecto de alfanumericos
 */
router.get(/([a-z]+)-([0-9]+)$/, (request, response, nextHandler) => {
	nextHandler();
});
// Output: {"0":"abc","1":"12345"} for path /abc-12345

/**
 * pasando más de un parametro por url
 */
router.get("/show/:id-:tag", (request, response, nextHandler) => {
	response.send(request.params);
});
// Outputs: {"id":"abc","tag":"12345"} for /abc-12345

router.get("/edit/:userId/:action-:where", (request, response, nextHandler) => {
	response.send(request.params);
});
// Route path: /123/edit-profile
// Outputs: {"userId":"123","action":"edit","where":"profile"}

/**
 * controlar una exception
 */
router.get("/exp", (request, response, next) => {
	try {
		throw new Error("Oh no!, something went wrong!");
	} catch (err) {
		next(err);
	}
});
module.exports = router;
