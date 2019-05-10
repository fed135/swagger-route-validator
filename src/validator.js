const set = require('lodash.set');
const valueValidator = require('./valueValidator');

function validate(spec, req) {
  const setDefault = (cursor, value) => {
    set(req, cursor, value);
  };
  
  const errors = [];

  for (let i = 0; i < spec.params.length; i++) {
    const param = spec.params[i];
    const value = param.in === 'body' ? req.body : req[param.in][param.name];
    const cursor = param.in === 'body' ? 'body' : `${param.in}.${param.name}`;

    valueValidator(cursor, value, spec, req, setDefault, errors);
  }
  return errors;
}

// Exports

module.exports = validate;
