const fs = require('fs');
const path = require('path');
const { DefinePlugin } = require('webpack');

const PLUGIN = 'NodeConfigWebpack';
const MODULE_NAME_REQUEST = 'config';
const GENERATED = path.resolve(__dirname, '.config.generated.js');

const define = ({ definitions, compiler }) => new DefinePlugin(definitions).apply(compiler);

class NodeConfigWebpack {
  constructor(options = {}) {
    this.options = options;
  }

  processAsEnv(config, compiler) {
    if (typeof this.options.env === 'string') {
      const key = this.options.env;
      return define({
        definitions: { [`process.env.${key}`]: JSON.stringify(config) },
        compiler,
      });
    }

    // Build flat list of env variables
    return define({
      definitions: Object.entries(config || {}).reduce((a, [k, v]) => {
        a[`process.env.${k}`] = JSON.stringify(v);
        return a;
      }, {}),
      compiler,
    });
  }

  processAsConstant(config, compiler) {
    const key =
      typeof this.options.constant === 'string'
        ? this.options.constant
        : 'CONFIG';
    return define({
      definitions: { [key]: JSON.stringify(config) },
      compiler,
    });
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

    compiler.hooks.normalModuleFactory.tap(PLUGIN, (nmf) => {
      nmf.hooks.beforeResolve.tap(PLUGIN, (result) => {
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

module.exports = NodeConfigWebpack;
