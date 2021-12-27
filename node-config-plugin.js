const fs = require('fs');
const path = require('path');
const { DefinePlugin } = require('webpack');

const PLUGIN = 'NodeConfigPlugin'
const MODULE_NAME_REQUEST = 'config';
const GENERATED = path.resolve(__dirname, '.config.generated.js');

class NodeConfigPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  processAsEnv(config, compiler) {
    const env = Object.entries(config || {}).reduce((a, [k,v]) => {
      a[`process.env.${k}`] = JSON.stringify(v);
      return a;
    }, {});
  
    new DefinePlugin(env).apply(compiler);
  }

  processAsConstant(config, compiler) {
    new DefinePlugin({ CONFIG: JSON.stringify(config) }).apply(compiler);
  }

  processDefault(config, compiler) {
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

  apply(compiler) {
    const config = require('config');
    if (this.options.env) {
      return this.processAsEnv(config, compiler);
    }
    if (this.options.constant) {
      return this.processAsConstant(config, compiler);
    }

    return this.processDefault(config, compiler);
  }
}

module.exports = NodeConfigPlugin;