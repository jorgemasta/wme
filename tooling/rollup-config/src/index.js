import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cwd } from 'process';
import { defineConfig } from 'rollup';
import resolvePlugin from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy'
import execute from "rollup-plugin-shell";

const pkg = JSON.parse(readFileSync(resolve(cwd(), './package.json')));
const isProd = process.env.NODE_ENV === 'production';

const defaultPlugins = [
  resolvePlugin(),
  commonjs({
    include: /node_modules/,
  }),
  copy({
    targets: [
     { src: 'src/assets/**/*', dest: 'dist/assets' }
    ]
  })
];

const onwarn = (warning, rollupWarn) => {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
};

export const esmConfig = defineConfig({
  input: pkg.source,
  inlineDynamicImports: true,
  output: {
    file: pkg.module,
    format: 'esm',
  },
  onwarn,
  plugins: [
    peerDepsExternal({
      includeDependencies: true,
    }),
    ...defaultPlugins,
    typescript({
      clean: true,
    }),
    execute({
      commands: process.env.yalc === 'true' ? ['yalc push --sig --quiet'] : [],
      hook: 'writeBundle'
    })
  ],

});

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react/jsx-runtime': 'jsxRuntime',
  ...(pkg.rollup?.globals || {}),
};

export const umdConfig = defineConfig({
  input: pkg.source,
  inlineDynamicImports: true,
  output: {
    file: pkg.main,
    format: 'umd',
    exports: 'named',
    name: pkg.rollup?.name || 'Wme',
    globals,
  },
  onwarn,
  plugins: [
    peerDepsExternal(),
    ...defaultPlugins,
    typescript({
      clean: true,
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    terser(),
  ],
});

export default isProd ? [esmConfig, umdConfig] : esmConfig;
