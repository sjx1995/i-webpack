import { foo } from "./foo.js";
import { bar } from "./bar.js";
import testJson from "./test.json";

const main = () => {
  foo();
  bar();
  console.log("main");
  console.log("使用loader解析的json", testJson);
};

main();
