# NodeConfigPlugin
This plugin hooks into webpacks compilation to replace the config module with its environment equivalent. This eliminates the need to pull config in dynamic at runtime. 

## Installation
```shell
yarn add node-config-webpack
```

## Usage
_webpack.config.js_
```javascript
const NodeConfigPlugin = require('node-config-webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  plugins: [
    new NodeConfigPlugin()
  ]
}
```

## Config Usage
Config usage or specific issues can be resolved here [here](https://www.npmjs.com/package/config)


