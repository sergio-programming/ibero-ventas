const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");

const UserSchema = new Schema({
	cedula: {
		index: true,
		type: Number,
		minlength: 6,
		unique: true,
		maxlength: 16,
		required: [true, "La cedula es un valor requerido"],
		validate: {
			validator: function (value) {
				return /^[0-9]+$/.test(value);
			},
			message: "{VALUE} is not a valida la cedula."
		}
	},
	nombres: { type: String, required: true, maxlength: 60 },
	apellidos: { type: String, required: true, maxlength: 60 },
	email: { type: String, required: true, maxlength: 100 },
	celular: { type: String, required: false, maxlength: 13 },
	clave: { type: String, required: true, maxlength: 225, minlength: 5 },
	token: { type: String, required: false},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

UserSchema.static("login", async function (cedula, pwd) {
	const hash = crypto.createHash("sha256").update(String(pwd));
	const user = await this.findOne().where("cedula").equals(cedula).where("clave").equals(hash.digest("hex"));
	if (!user) throw new Error("Incorrect credentials.");
	delete user.clave;
	return user;
});

UserSchema.static("signup", async function (cedula, pwd, data) {
	if (pwd.length < 8) {
		throw new Error("Pwd must have more than 8 chars");
	}
	const hash = crypto.createHash("sha256").update(pwd);
	const exist = await this.findOne().where("cedula").equals(cedula);
	if (exist) throw new Error("La cedula already exists.");
	
	data.clave = hash.digest("hex"); 
	const user = this.create(data);
	return user;
});

UserSchema.method("changePass", async function (pwd) {
	if (pwd.length < 8) {
		throw new Error("Pwd must have more than 8 chars");
	}
	const hash = crypto.createHash("sha256").update(pwd);
	this.clave = hash.digest("hex");
	return this.save();
});

UserSchema.method("isValidPassword", async function (pwd) {
	const user = this;
	const compare = crypto.createHash("sha256").update(pwd) === user.clave;
	return compare;
});

UserSchema.method("createPasswors", async function(){
	try {
		var length = 8,
		charset = "@#$&*.+-_123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*123456789abcdefghijkmnopqrstuvwxyz",
		pwd = "";
		for (var i = 0, n = charset.length; i < length; ++i) {
			pwd += charset.charAt(Math.floor(Math.random() * n));
		}
		const hash = crypto.createHash("sha256").update(pwd);
		this.clave = hash.digest("hex");
		this.save();
		return { clave: pwd, hash: this.clave};
	} catch (error) {
		console.log(error);
		return false;
	}
});

UserSchema.method("fillable", async function(){
	try {
		return { 
			email: this.email,
			cedula: this.cedula,
			nombres: this.nombres,
			apellidos: this.apellidos,
			celular: this.celular,
			username: this.nombres+' '+this.apellidos
		};
	} catch (error) {
		console.log(error);
		return false;
	}
});

module.exports = mongoose.model("User", UserSchema);