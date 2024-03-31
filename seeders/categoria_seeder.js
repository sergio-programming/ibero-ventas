const Categoria = require("../models/categoria");

const _categorias = [
    {
        serial: 1,
        detalle: "Bebidas gaseosas",
        photo: "bebida01.jpg",
        tipo: "B",
        estado: "A"
    },
    {
        serial: 2,
        detalle: "Desayunos rapidos",
        photo: "desayuno.jpg",
        tipo: "S",
        estado: "A"
    },
    {
        serial: 3,
        detalle: "Desayunos Full",
        photo: "desayuno.jpg",
        tipo: "S",
        estado: "A"
    },
    {
        serial: 4,
        detalle: "Bebidas De Cafe",
        photo: "cafe.jpg",
        tipo: "B",
        estado: "A"
    },
    {
        serial: 5,
        detalle: "Pan Caliente",
        photo: "pan.jpg",
        tipo: "S",
        estado: "A"
    },
    {
        serial: 6,
        detalle: "Bebidas Cero Azucar",
        photo: "bebida02.jpg",
        tipo: "B",
        estado: "A"
    }
];

const Seeder = async function(){
    let ai = 0;
	while (ai < _categorias.length) {
		let categoria = _categorias[ai];
        const entity = new Categoria(categoria);
		await entity.save();
        ai++;
    }
	return await Categoria.find();
}

module.exports = { Seeder : Seeder };