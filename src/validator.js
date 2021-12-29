const {validateValue, set} = require('./valueValidator');

function validate(spec, req) {
  const errors = [];

  if (spec.parameters) {
    for (let i = 0; i < spec.parameters.length; i++) {
      const param = spec.parameters[i];
      const value = param.in === 'body' ? req.body : (req[param.in] && req[param.in][param.name]) || (req.params && req.params[param.name]) || undefined;
      const cursor = param.in === 'body' ? 'body' : `${param.in}.${param.name}`;

      validateValue(cursor, value, param, set(req), errors);
    }
  }
  return errors;
}

// Exports

module.exports = validate;
