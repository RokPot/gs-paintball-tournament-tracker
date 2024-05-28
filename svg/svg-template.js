const newline = require('./newline');

const template = (variables, { tpl, ...rest }, hey) => {
  return tpl`
${variables.imports}

${newline}

${variables.interfaces};

const ${`${variables.componentName.slice(3)}Icon`} = (${variables.props}) => (
${variables.jsx}
);
export default ${`${variables.componentName.slice(3)}Icon`};
`;
};

module.exports = template;
