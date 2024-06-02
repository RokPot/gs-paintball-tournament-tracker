const path = require('path');

module.exports = {
  icon: true,
  expandProps: 'end',
  outDir: path.join(__dirname, '../src/assets/icons'),
  ignoreExisting: false,
  typescript: true,
  prettier: false,
  svgProps: {
    className: 'fill-current',
  },
  dimensions: false,
  index: false,
  template: require('./svg-template'),
  replaceAttrValues: {
    '#00000000': 'transparent',
    '#ffffff00': 'transparent',
  },
};
