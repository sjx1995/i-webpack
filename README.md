# i-webpack

实现webpack的核心打包流程

## 打包核心流程

### 遍历所有依赖

从入口文件开始，查找并收集依赖赖，放入一个队列，遍历队列中的每个依赖，直到队列为空，然后我们就能获取到所有的依赖内容、依赖之间的关系和相对路径，并根据路径生成依赖图

### 如何从模块中获取依赖

读取模块内容，使用`@babel/parser`将模块内容解析成AST，然后使用`@babel/traverse`遍历AST，找到`import`语句就找到了每个模块的依赖

### 打包后命名冲突

将很多模块打包到同一个js文件中，就会出现命名冲突的问题，所以我们需要将每个模块包裹在一个函数中

但这又出现了一个问题，原本模块是使用ESModule的方式引用的，ESModule规范中`import`只能出现在模块顶层，不能出现在函数中，所以我们使用`@babel/plugin-transform-modules-commonjs`将ESModule转换成CommonJS规范的语法：使用`require()`进行导入，使用`module.exports`进行导出，为此还要在模板中简单实现`require()`和`module.exports`的功能

### 生成bundle

`bundle.js`文件中有动态写入的模块代码、依赖关系等，也有静态的`require()`等方法，所以我们使用`ejs`模板引擎动态生成`bundle.js`文件

有了依赖关系、模块代码，我们就可以将每个模块的代码放在函数中，将这些模块合并写入`bundle.js`

## 示例

在`./src/example/`文件夹下是一个简单的示例，其中`main.js`是入口文件

模块间的引用关系:

```text
main.js
├── foo.js
│   └── baz.js
└── bar.js
```

## 用法

```bash
# 在./dist/目录下生成打包后的文件bundle.js
yarn build
```
