import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
import { mdsvex } from 'mdsvex';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        },
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'esm', // 'iife',
    name: 'app',
    // file: 'public/build/bundle.js',
    dir: 'public/build/',
    chunkFileNames: '[name].js',
  },
  plugins: [
    commonjs(),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
      extensions: ['.svelte', '.svx'],
      preprocess: [
        sveltePreprocess({
          // sourceMap: !production,
          postcss: {
            plugins: [require('tailwindcss')],
          },
        }),
        mdsvex({
          layout: {
            _: 'src/Page.svelte',
          },
        }),
      ],
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // nodePolyfills({
    //   include: ['node_modules/pixi.js/**'],
    //   url: true,
    // }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plug ins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      // preferBuiltins: true,
      dedupe: ['svelte'],
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
