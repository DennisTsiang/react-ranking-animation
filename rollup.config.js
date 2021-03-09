import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import visualizer from 'rollup-plugin-visualizer';

export default {
  input: 'src/index.js',
  output: [
    {
      dir: 'dist',
      format: 'cjs'
    }
  ],
  plugins: [
    peerDepsExternal(),
    postcss({ extract: true }),
    babel({ exclude: 'node_modules/**' }),
    resolve(),
    image(),
    commonjs(),
    visualizer()
  ]
};
