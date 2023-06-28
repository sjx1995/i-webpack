import path from "path";
import jsonLoader from "./example/json-loader.js";
import ChangeBundleName from "./example/changeBundleName.js";

export default {
  entry: "./src/example/main.js",
  output: {
    path: path.resolve(process.cwd(), "./dist"),
    filename: "output.js",
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        use: jsonLoader,
      },
    ],
  },
  plugins: [new ChangeBundleName("bundle.js")],
};
