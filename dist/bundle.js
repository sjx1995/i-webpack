(function (modules) {
  function require(id) {
    // debugger;
    const module = {
      exports: {},
    };

    // 通过id查找对应的函数体和对应关系
    const [fn, mapping] = modules[id];

    // 将代码中的传入require函数的路径转换成id，再传入require函数查找对应的函数体和对应关系
    function localRequire(path) {
      const id = mapping[path];
      return require(id);
    }

    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require(0);
})({
  
    0 : [
      function (require, module, exports) {
        "use strict";

var _foo = require("./foo.js");
var _bar = require("./bar.js");
var _test = _interopRequireDefault(require("./test.json"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var main = function main() {
  (0, _foo.foo)();
  (0, _bar.bar)();
  console.log("main");
  console.log("使用loader解析的json", _test["default"]);
};
main();
      },
      {"./foo.js":1,"./bar.js":2,"./test.json":3}
      
    ],
  
    1 : [
      function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = void 0;
var foo = function foo() {
  console.log("foo");
};
exports.foo = foo;
      },
      {}
      
    ],
  
    2 : [
      function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = void 0;
var _baz = require("./sub-dir/baz.js");
var bar = function bar() {
  (0, _baz.baz)();
  console.log("bar");
};
exports.bar = bar;
      },
      {"./sub-dir/baz.js":4}
      
    ],
  
    3 : [
      function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = "{\n  \"name\": \"test\",\n  \"direction\": \"这是一个json文件\",\n  \"file-type\": \"json\"\n}\n";
exports["default"] = _default;
      },
      {}
      
    ],
  
    4 : [
      function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baz = void 0;
var baz = function baz() {
  console.log("baz");
};
exports.baz = baz;
      },
      {}
      
    ],
  
});
