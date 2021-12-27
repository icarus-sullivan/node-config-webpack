const { resolve } = require('path');

const NodeConfigPlugin = require("./node-config-plugin");

module.exports = {
  entry: [
    './src/index.js'
  ],
  plugins: [
    new NodeConfigPlugin({
      env: true,
    })
  ],
  output: {
    path: resolve(__dirname, 'build'),
  },
};
