import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import vue from 'rollup-plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
const glob = require('glob');
const path = require('path');

// 获得所有组件 {"button":"./src/components/button/index.js"}
const componentsObject = glob
  .sync(`src/components/**/index.js`, {
    dot: true
  })
  .map((x) => path.resolve(x))
  .map((x) => path.dirname(x).split(path.sep).pop())
  .reduce((p, name) => {
    p[name] = `./src/components/${name}/index.js`;
    return p;
  }, {});

const configFn = (name) => ({
  plugins: [
    vue(),
    vueJsx(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    commonjs(),
    postcss({
      plugins: [autoprefixer(), cssnano()],
      extract: `theme-chalk/${name}.css`
    }),
    terser()
  ],
  external: [
    //外部库， 使用'umd'文件时需要先引入这个外部库
    'vue'
  ]
});

const comConfigs = Object.keys(componentsObject).map((name) => {
  const config = configFn(name);
  config.input = [componentsObject[name]];
  config.output = {
    file: './lib/' + name + '.js',
    format: 'es'
  };
  return config;
});

const umdConfig = {
  input: './src/index.js',
  output: [
    {
      file: './dist/my-lib-umd.js',
      format: 'umd',
      name: 'myLib'
    },
    {
      file: './dist/my-lib-es.js',
      format: 'es'
    },
    {
      file: './dist/my-lib-cjs.js',
      format: 'cjs'
    }
  ],
  ...configFn('index')
};
umdConfig.plugins.unshift(del({ targets: ['lib/*', 'dist/*'] }));
console.log('comConfigs', comConfigs);
export default [umdConfig, ...comConfigs];
