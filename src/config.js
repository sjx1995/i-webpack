import path from "path";
import jsonLoader from "./example/json-loader.js";

export default {
  entry: "./src/example/main.js",
  output: {
    path: path.resolve(process.cwd(), "./dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        use: jsonLoader,
      },
    ],
  },
};
