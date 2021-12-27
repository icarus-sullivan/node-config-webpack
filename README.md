# NodeConfigPlugin
This plugin hooks into webpacks compilation to replace the [config](https://www.npmjs.com/package/config) module with its environment equivalent. This eliminates the need to pull config in dynamically at runtime. 

## Installation
```shell
yarn add node-config-webpack
```

## Usage
Your typical usage will replace the config module with an environment specific override. For this usage, just import the plugin and add it to webpack. 

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

## Experimental Options

### Experiment Option - Env
This option will inject your environment configuration into `process.env` automatically. NOTE: To use this option, config should all be root level items. Additionally all key values will be coerced into uppercase to match process.env convention.

_webpack.config.js_
```javascript
const NodeConfigPlugin = require('node-config-webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  plugins: [
    new NodeConfigPlugin({
      env: true,
    })
  ]
}
```

_Example_:
```javascript
console.log('Configuration version is', process.env.VERSION);
```

### Experiment Option - Constant
This option will inject your environment configuration into a global `CONFIG` variable. No coercion will be done to the generated config.

_webpack.config.js_
```javascript
const NodeConfigPlugin = require('node-config-webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  plugins: [
    new NodeConfigPlugin({
      constant: true,
    })
  ]
}
```

_Example_:
```javascript
console.log('Configuration version is', CONFIG.version);
```

* Please note, experimental options are there for flexibility. Most projects won't need them as the 99% use case will be the typical usage.