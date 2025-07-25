import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

const isProd = (process.env.BUILD === 'production');

export default {
  input: 'main.ts',
  output: {
    dir: 'dist',
    sourcemap: isProd ? false : 'inline',
    format: 'cjs',
    name: 'main',
  },
  external: ['obsidian'],
  plugins: [
    typescript(),
    nodeResolve({ browser: true }),
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' },
        { src: 'styles.css', dest: 'dist' }
      ]
    })
  ]
};
