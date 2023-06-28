import { baz } from "./sub-dir/baz.js";

export const bar = () => {
  baz();
  console.log("bar");
};
