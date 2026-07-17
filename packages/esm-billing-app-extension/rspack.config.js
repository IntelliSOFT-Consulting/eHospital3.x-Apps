const extendConfig = require('openmrs/default-rspack-config');

module.exports = (env, argv) => {
  const config = extendConfig(env, argv);
  
  if (config.module && config.module.rules) {
    config.module.rules = config.module.rules.map(rule => {
      // Find rules that use swc-loader
      if (
        rule.loader === 'builtin:swc-loader' ||
        (rule.use && rule.use.loader === 'builtin:swc-loader') ||
        (Array.isArray(rule.use) && rule.use.some(u => u === 'builtin:swc-loader' || (u && u.loader === 'builtin:swc-loader')))
      ) {
        return {
          ...rule,
          // Overwrite exclude to allow compiling @openmrs packages located in node_modules
          exclude: /node_modules\/(?!@openmrs\/)/,
        };
      }
      return rule;
    });
  }

  if (config.plugins) {
    // Remove the strict TS checker plugin to prevent it from choking on node_modules/@openmrs TS definitions
    config.plugins = config.plugins.filter(p => p.constructor.name !== 'TsCheckerRspackPlugin');
  }

  return config;
};
