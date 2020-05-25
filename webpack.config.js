const path = require("path");
const BUILD_DIR = path.resolve(__dirname, "./public/build");
const APP_DIR = path.resolve(__dirname, "./client");
const TerserPlugin = require("terser-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

module.exports = {
	entry: {
		main: APP_DIR + "/index.js",
	},
	output: {
		filename: "bundle.js",
		path: BUILD_DIR,
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/react"],
					},
				},
			},
			{
				test: /\.css$/,
				loader: "style-loader!css-loader",
			},
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				loader: "url-loader",
				options: {
					limit: 10000,
				},
			},
		],
	},
	mode,
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					ecma: 6,
				},
			}),
		],
	},
	devtool: mode === "development" ? "inline-source-map" : false,
};
