const { resolve } = require('path');

const NodeConfigWebpack = require('./node-config-plugin');

module.exports = {
  entry: ['./src/index.js'],
  plugins: [
    new NodeConfigWebpack({
      // env: true,
      // env: 'CONFIG',
      // constant: true,
      // constant: 'customValue',
    }),
  ],
  output: {
    path: resolve(__dirname, 'build'),
  },
};
