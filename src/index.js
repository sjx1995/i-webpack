import babelCore from "@babel/core";
import babelParser from "@babel/parser";
import pluginTransformModulesCommonJS from "@babel/plugin-transform-modules-commonjs";
import babelTraverse from "@babel/traverse";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import process from "process";
import tapable, { SyncHook } from "tapable";
import config from "./config.js";

let id = 0; // 生成mapping使用的唯一id

// 收集所有引用的文件关系和内容
const createAsset = (modulePath) => {
  const deps = [];

  // 读取文件内容
  let source = fs.readFileSync(modulePath, "utf-8");

  // loader的作用是将非js模块转换成js模块
  // 所以loader的执行时机应该是在读取文件内容之后，转换成ast之前
  const loaders = config.module && config.module.rules;
  if (loaders) {
    loaders.forEach(({ test, use }) => {
      if (test.test(modulePath)) {
        source = use(source);
      }
    });
  }

  // 转换ast
  const ast = babelParser.parse(source, { sourceType: "module" });

  // 将ESModule的依赖语句转换成类似CommonJs的语法
  // 因为ESModule的引入语句必须出现在模块的顶层
  // 但是将很多js文件合并到一个文件后，为了避免命名冲突，我们要将每个模块都封装到一个函数中，所以依赖语句可以改写成require函数放在函数中动态加载
  // 所以我们要在模板(./src/template/index.ejs)中自己实现一个导入方法require()和对应的导出对象module.exports
  const { code: commonJsCode } = babelCore.transformFromAstSync(ast, null, {
    plugins: [pluginTransformModulesCommonJS],
    presets: ["@babel/preset-env"],
  });

  // 查找import信息，将当前文件引入的依赖的相对路径都放在deps数组中，为下一步遍历所有依赖做准备
  babelTraverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });

  // 返回文件的所有引入依赖和内容
  return {
    id: id++,
    deps,
    modulePath,
    commonJsCode,
  };
};

// 使用队列构建图
const createGraph = (entry) => {
  const target = []; // 构建出来的包含源码、id、mapping、路径等关系的数据都放在target
  const queue = [entry]; // 维护一个队列，用于遍历所有的依赖
  const depsMap = new Map(); // 构建依赖相对路径和id的关系

  while (queue.length) {
    const curPath = queue.shift();
    const srcPath = path.resolve(process.cwd(), "./src/example/");

    const asset = createAsset(path.resolve(process.cwd(), srcPath, curPath));

    const relativePath = "./" + path.relative(srcPath, asset.modulePath);
    target.push({
      ...asset,
      relativePath,
    });
    depsMap.set(relativePath, asset.id);

    queue.push(...asset.deps);
  }

  // 添加模块的依赖路径和id的关系，作为传入模板的module的第二个参数
  const data = target.map((item) => {
    const mapping = {};

    item.deps.forEach((dep) => {
      const id = depsMap.get(dep);
      if (id != null) {
        mapping[dep] = id;
      }
    });

    return {
      ...item,
      mapping,
    };
  });

  return data;
};

const createBundle = () => {
  const { entry, output, plugins } = config;

  // 注册插件
  class Hooks {
    constructor() {
      this.hooks = {
        emit: new SyncHook(["ctx"]),
      };
    }
  }
  const customHook = new Hooks();
  plugins &&
    plugins.forEach((plugin) => {
      customHook.hooks.emit.tap("emit-hook", (ctx) => {
        plugin.apply(ctx);
      });
    });

  let data = createGraph(path.resolve(process.cwd(), entry));

  // 读取模板并渲染
  const template = fs.readFileSync(
    path.resolve(process.cwd(), "./src/template/index.ejs"),
    { encoding: "utf-8" }
  );
  const bundle = ejs.render(template, { data });

  // 触发emit钩子
  customHook.hooks.emit.call(output);

  // 写入bundle文件
  const {} = config;
  fs.writeFileSync(path.resolve(output.path, output.filename), bundle, {
    encoding: "utf-8",
  });
};

createBundle();
