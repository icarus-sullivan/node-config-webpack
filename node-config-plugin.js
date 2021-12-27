const fs = require('fs');
const path = require('path');
const config = require('config');

// schema for options object
const OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    env: {
      type: 'boolean',
    },
    module: {
      type: 'boolean',
    },
    constant: {
      type: 'boolean',
    },
    constantName: {
      type: 'string'
    }
  },
};

const PLUGIN = 'NodeConfigPlugin'
const MODULE_NAME_REQUEST = 'config';
const GENERATED = path.resolve(__dirname, '.config.generated.js');
const TEMPLATE = `const LEADING_ARRAY = /\\[/g;
const TRAILING_ARRAY = /^\\[|\\]/g;
    
const dot = (setting) =>
  setting.replace(TRAILING_ARRAY, '').replace(LEADING_ARRAY, '.').split('.');
const pick = (obj, setting) => {
    try {
        return dot(setting).reduce((a, b) => a[b], obj);
    } catch (e) {
        return undefined;
    }
};
const config = ${JSON.stringify(config, null, 2)};
module.exports = { 
  ...config, 
  get: (setting) => pick(config, setting),
  has: (setting) => !!pick(config, setting),
};`;

class NodeConfigPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  processAsEnv(compiler) {
    const env = Object.entries(config || {}).reduce((a, [k,v]) => {
      a[`process.env.${k.toUpperCase()}`] = JSON.stringify(v);
      return a;
    }, {});
  
    new DefinePlugin(env).apply(compiler);
  }

  apply(compiler) {
    if (this.options.env) {
      return this.processAsEnv(compiler);
    }
    compiler.hooks.normalModuleFactory.tap(PLUGIN, nmf => {
      nmf.hooks.beforeResolve.tap(PLUGIN, result => {
        if (result.request === MODULE_NAME_REQUEST) {
          fs.writeFileSync(GENERATED, TEMPLATE, 'utf8');
          result.request = GENERATED;
        }
      });
    });

    // Clean up 
    compiler.hooks.done.tap(PLUGIN, () => {
      if (fs.existsSync(GENERATED)) {
        fs.unlinkSync(GENERATED);
      }
    });
  }
}

module.exports = NodeConfigPlugin;