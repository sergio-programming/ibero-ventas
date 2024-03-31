import _ from "underscore";

const Utils = {
	env: "development", // development || production
	hostDev: "localhost",
	hostPro: "3.148.102.49",
	portDev: "3000",
	portPro: "80",

	getUrl: (/** @type {any} */ url) => {
		if ((_.isUndefined(url), _.isEmpty(url))) url = "";
		if (Utils.env === "development" || Utils.env === "dev") {
			return `http://${Utils.hostDev}:${Utils.portDev}/${url}`;
		} else {
			return `http://${Utils.hostPro}:${Utils.portPro}/${url}`;
		}
	},

	openWin: (/** @type {array} */ options, /** @type {any} */ _blank = "", /** @type {any} */ content = "") => {
		if (_.isNull(options) || _.isEmpty(options)) {
			options = ["width=800", "height=600", "toolbar=0", "scrollbars=1", "resizable=1", "top=500", "left=500", "fullscreen=0"];
		}
		const win = window.open("", _blank, options.join(","));
		if (!(_.isNull(content) || _.isEmpty(content))) win.document.write(content);
		return win;
	},

	redirectParent: (/** @type {string} */ url) => {
		Utils.redirectTo(url, window.parent);
		return null;
	},

	redirectOpener: (/** @type {string} */ url) => {
		const win = Utils.redirectTo(url, window.opener);
		return null;
	},

	redirectTo: (/** @type {string} */ url, /** @type {Object} */ win) => {
		win = win ? win : window;
		win.location = Utils.getUrl(url);
		return null;
	},

	upperCaseFirst: (/** @type {string} */ str) => {
		let first = str.substring(0, 1).toUpperCase();
		return first + str.substr(1, str.length - 1);
	},

	round: (/** @type {number} */ number, /** @type {number} */ decimals) => {
		let decimalPlace = Math.pow(100, decimals);
		return Math.round(number * decimalPlace) / decimalPlace;
	},

	isEmail: (/** @type {string} */ valor) => {
		if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(valor) || _.isNull(valor)) {
			return "el valor del email no es valido";
		}
		return null;
	},

	isDate: (/** @type {string} */ valor) => {
		if (!/^([0-9]+){4}(\-|\/)?([0-9]+){2}(\-|\/)?([0-9]+){2}$/.test(valor) || _.isNull(valor)) {
			return "debe ser un valor de fecha valido";
		}
		return null;
	},

	isNumber: (/** @type {string} */ valor) => {
		if (!/^([0-9]+){1,20}$/.test(valor) || _.isNull(valor)) {
			return "debe ser un valor de número valido";
		}
		return null;
	}
};

export default Utils;
