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
    '#000': 'currentColor',
    '#000000': 'currentColor',
    '#00000000': 'transparent',
    '#fff': 'currentColor',
    '#ffffff': 'currentColor',
    '#ffffff00': 'transparent',
  },
};
