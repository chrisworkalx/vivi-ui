import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import vue from "rollup-plugin-vue";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
const glob = require("glob");
const path = require("path");

// 获得所有组件 {"button":"./src/components/button/index.js"}
const componentsObject = glob
  .sync(`src/components/**/index.js`, {
    dot: true,
  })
  .map((x) => path.resolve(x))
  .map((x) => path.dirname(x).split(path.sep).pop())
  .reduce((p, name) => {
    p[name] = `./src/components/${name}/index.js`;
    return p;
  }, {});

export default {
  input: ["./src/index.js", Object.values(componentsObject)],
  output: [
    {
      file: "./dist/my-lib-umd.js",
      format: "umd",
      name: "myLib",
      //当入口文件有export时，'umd'格式必须指定name
      //这样，在通过<script>标签引入时，才能通过name访问到export的内容。
    },
    {
      file: "./dist/my-lib-es.js",
      format: "es",
    },
    {
      file: "./dist/my-lib-cjs.js",
      format: "cjs",
    },
  ],
  plugins: [
    del({ targets: "dist/*" }),
    vue(),
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true,
    }),
    commonjs(),
    postcss({
      plugins: [autoprefixer(), cssnano()],
      extract: "[name]/css/index.css",
    }),
    terser(),
  ],
  external: [
    //外部库， 使用'umd'文件时需要先引入这个外部库
    "vue",
  ],
};
