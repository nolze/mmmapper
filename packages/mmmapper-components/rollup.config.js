import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// import replace from '@rollup/plugin-replace';
// import legacy from '@rollup/plugin-legacy';
// import inject from '@rollup/plugin-inject';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
// import { relative } from 'path';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

const options = {
  // moduleContext: {
  //   'node_modules/pixi-projection': 'window',
  // },
  plugins: [
    commonjs({
      // exclude: [relative('./', require.resolve('pixi.js/dist/pixi.js'))],
    }),
    // https://github.com/sveltejs/svelte/issues/3165#issuecomment-699985503
    // replace({
    //   'outros.c.push':
    //     'if (outros === undefined) { block.o(local); return }\noutros.c.push',
    // }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
      preprocess: sveltePreprocess({
        // sourceMap: !production,
      }),
    }),
    // nodePolyfills({
    //   include: ['node_modules/pixi.js/**'],
    //   url: true,
    // }),
    // inject({
    //   include: ['node_modules/pixi-projection/**'],
    //   PIXI: 'pixi.js',
    //   // PIXI: path.resolve('src/components/lib/pixi/index.js'),
    // }),
    resolve({
      preferBuiltins: true,
    }),
  ],
};

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.module, format: 'es' },
      { file: pkg.main, format: 'umd', name },
    ],
    ...options,
  },
  // {
  //   input: 'src/elements/index.js',
  //   output: [
  //     { file: pkg.exports['./elements'].import, format: 'es' },
  //     { file: pkg.exports['./elements'].require, format: 'umd', name },
  //   ],
  //   ...options,
  // },
];
