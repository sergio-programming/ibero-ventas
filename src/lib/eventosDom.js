import $ from "jquery";
import _ from "underscore";

const toggleSeleccion = (el) => {
	let radioButton = el.querySelector('input[type="radio"]');
	let estadoAnterior = radioButton.getAttribute("data-anterior");
	if (estadoAnterior === "true") {
		radioButton.checked = false;
	} else {
		radioButton.checked = true;
	}
};

const capturarEstado = (el) => {
	var radioButton = el.querySelector('input[type="radio"]');
	var estadoAnterior = radioButton.checked;
	radioButton.setAttribute("data-anterior", estadoAnterior);
};

const eventosDom = function () {
	document.querySelectorAll(".writing :is(input, textarea)").forEach(function (element) {
		element.addEventListener("input", function () {
			let valor = $(element).val();
			if (_.isEmpty(valor) || _.isUndefined(valor)) {
				$(element).removeClass("has-text");
			} else {
				$(element).addClass("has-text");
			}
		});
	});

	document.querySelectorAll(".textarea textarea").forEach((textarea) => {
		textarea.addEventListener("input", () => {
			$(textarea).css("height", "1em");
			const scrollHeight = textarea.scrollHeight;
			$(textarea).css("height", `${scrollHeight}px`);
		});
	});

	$("[data-toggle='toggle_seleccion1']").on("click", function (e) {
		e.preventDefault();
		let el = document.querySelector("[data-toggle='toggle_seleccion1']");
		toggleSeleccion(el);
	});

	$("[data-toggle='toggle_seleccion2']").on("click", function (e) {
		e.preventDefault();
		let el = document.querySelector("[data-toggle='toggle_seleccion2']");
		toggleSeleccion(el);
	});

	$("[data-toggle='toggle_seleccion2']").on("onmousedown", function (e) {
		e.preventDefault();
		let el = document.querySelector("[data-toggle='toggle_seleccion2']");
		capturarEstado(el);
	});

	$("[data-toggle='toggle_seleccion1']").on("onmousedown", function (e) {
		e.preventDefault();
		let el = document.querySelector("[data-toggle='toggle_seleccion1']");
		capturarEstado(el);
	});
};

export default eventosDom;
