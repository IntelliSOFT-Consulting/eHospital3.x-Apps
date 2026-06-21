const config = require('openmrs/default-webpack-config');

config.scriptRuleConfig.exclude = /node_modules\/(?!@openmrs)/;

module.exports = config;
