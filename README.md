# Installation
```shell
yarn add node-config-plugin
```

# Usage
_webpack.config.js_
```javascript
const NodeConfigPlugin = require('node-config-plugin');

module.exports = {
  entry: [
    './src/index.js'
  ],
  plugins: [
    new NodeConfigPlugin()
  ]
}
```