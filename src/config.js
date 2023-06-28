import path from "path";

export default {
  entry: "./src/example/main.js",
  output: {
    path: path.resolve(process.cwd(), "./dist"),
    filename: "bundle.js",
  },
};
