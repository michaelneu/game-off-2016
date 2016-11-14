var webpack = require("webpack");

module.exports = {
  entry: "./web/static/ts/app.ts",
  
  output: {
    filename: "app.js",
    path: __dirname + "/priv/static"
  },
  
  resolve: {
    extensions: ["", ".ts", ".js", ".less"]
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      },
      {
        test: /\.less$/,
        loader: "less"
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],

  progress: true
};