const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  //there is no reason to shrink in production mode. dev mode will help debugging
  mode: "development",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib"),
    libraryTarget: "umd",
    library: "inject-react",
  },
};
