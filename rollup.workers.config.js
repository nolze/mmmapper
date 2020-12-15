import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [
  {
    input: 'src/workers/repl.js',
    output: {
      sourcemap: true,
      format: 'esm',
      name: 'app',
      file: 'public/build/workers/repl.js',
    },
    plugins: [
      json(),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),
    ],
    watch: {
      clearScreen: false,
      include: 'src/workers/**',
    },
  },
];
