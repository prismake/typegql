import typescript from 'rollup-plugin-typescript2'

const pkg = require('./package.json')

export default {
  input: './src/index.ts',
  entry: './src/index.ts',
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  output: { file: pkg.main, name: 'decapi', format: 'cjs' },
  cacheRoot: './cache/.rpt2',
  plugins: [typescript()]
}
