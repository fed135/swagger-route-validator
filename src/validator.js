const set = require('lodash.set');
const {validateValue} = require('./valueValidator');

function validate(spec, req) {
  const setDefault = (cursor, value) => {
    set(req, cursor, value);
  };
  
  const errors = [];

  if (spec.parameters) {
    for (let i = 0; i < spec.parameters.length; i++) {
      const param = spec.parameters[i];
      const value = param.in === 'body' ? req.body : req[param.in][param.name] || req.params[param.name];
      const cursor = param.in === 'body' ? 'body' : `${param.in}.${param.name}`;

      validateValue(cursor, value, param, setDefault, errors);
    }
  }
  return errors;
}

// Exports

module.exports = validate;
