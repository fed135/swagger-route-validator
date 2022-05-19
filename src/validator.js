const {validateValue, set} = require('./valueValidator');

function validate(spec, req) {
  const errors = [];

  if (spec.parameters) {
    for (let i = 0; i < spec.parameters.length; i++) {
      const param = spec.parameters[i];
      const paramLocation = param.in === 'header' ? 'headers' : param.in;

      const value = paramLocation === 'body' ? req.body : (req[paramLocation] && req[paramLocation][param.name]) || (req.params && req.params[param.name]) || undefined;
      const cursor = paramLocation === 'body' ? 'body' : `${paramLocation}.${param.name}`;

      validateValue(cursor, value, param, set(req), errors, spec.definitions);
    }
  }
  return errors;
}

// Exports

module.exports = validate;
