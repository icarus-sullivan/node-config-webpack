# NodeConfigWebpack
This plugin hooks into webpacks compilation to replace the [config](https://www.npmjs.com/package/config) module with its environment equivalent. This eliminates the need to pull config in dynamically at runtime. 

## Installation
```shell
yarn add -D node-config-webpack
```

## Usage
Your typical usage will replace the config module with an environment specific override. For this usage, just import the plugin and add it to webpack. 

_webpack.config.js_
```javascript
const NodeConfigWebpack = require('node-config-webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  plugins: [
    new NodeConfigWebpack()
  ]
}
```

## Options

### Env
This option will inject your configuration into `process.env` automatically. However, it expects a root-level list of key-pair items, similar to an .env file. Additionally all keys will be coerced into uppercase to match process.env convention.

_webpack.config.js_
```javascript
const NodeConfigWebpack = require('node-config-webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  plugins: [
    new NodeConfigWebpack({
      env: true,
    })
  ]
}
```

_Example_:
```javascript
console.log('Configuration version is', process.env.VERSION);
```

If you want the config added to `process.env` without any coercion you can use a string for the `env` option:

_webpack.config.js_
```javascript
const NodeConfigWebpack = require('node-config-webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  plugins: [
    new NodeConfigWebpack({
      env: 'CONFIG',
    })
  ]
}
```

You can then reference your config from `process.env.<your_key>`.

_Example_:
```javascript
console.log('Configuration is', process.env.CONFIG);
```

### Constant
This option will replace any reference to the variable `CONFIG` with the generated equivalent.

_webpack.config.js_
```javascript
const NodeConfigWebpack = require('node-config-webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  plugins: [
    new NodeConfigWebpack({
      constant: true,
    })
  ]
}
```

_Example_:
```javascript
console.log('Configuration version is', CONFIG.version);
```

You can use a custom constant variable by passing a string as the `constant` value.

_webpack.config.js_
```javascript
const NodeConfigWebpack = require('node-config-webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  plugins: [
    new NodeConfigWebpack({
      constant: 'customValue',
    })
  ]
}
```

_Example_:
```javascript
console.log('Configuration version is', customValue.version);
```
