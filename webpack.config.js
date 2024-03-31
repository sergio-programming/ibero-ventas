const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/main.js",
	output: {
		compareBeforeEmit: false,
		path: path.resolve(__dirname, "public/"),
		filename: "bundle.js"
	},
	resolve: {
		extensions: [".mjs", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: /\.html$/i,
				exclude: /node_modules/,
				loader: "html-loader"
			}
		]
	},
	devServer: {
		port: 3001
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: "./src/index.html",
			filename: "index.html",
			port: 3001
		})
	]
};
