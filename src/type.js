const valueValidator = require('./valueValidator');
const makeError = require('./error');

// -- Atoms

function type(cursor, value, expectation, spec, setDefault, errors) {
  switch (expectation) {
    case 'string':
      string(cursor, value, errors);
      break;
    case 'integer':
      integer(cursor, value, errors);
      break;
    case 'number':
      number(cursor, value, errors);
      break;
    case 'boolean':
      boolean(cursor, value, errors);
      break;
    case 'array':
      list(cursor, value, spec, errors);
      break;
    case 'list':
      list(cursor, value, spec, errors);
      break;
    case 'object':
      object(cursor, value, spec, errors);
      break;
    case 'schema':
      object(cursor, value, spec, setDefault, errors);
      break;
  }
}

// data types

function string(cursor, value, errors) {
  if (typeof value !== 'string') {
    errors.push(makeError(cursor, value, 'Value is not a string'));
  }
}

function number(cursor, value, errors) {
  if (typeof value !== 'number') {
    errors.push(makeError(cursor, value, 'Value is not a number'));
  }
}

function integer(cursor, value, errors) {
  if (!Number.isInteger(value)) {
    errors.push(makeError(cursor, value, 'Value is not an integer'));
  }
}

function boolean(cursor, value, errors) {
  if (value !== true && value !== false && value !== 'true' && value !== 'false') {
    errors.push(makeError(cursor, value, 'Value is not a boolean'));
  }
}

function list(cursor, value, spec, errors) {
  // TODO
}

function object(cursor, value, spec, setDefault, errors) {
  if (spec.required.length) {
    const missingKeys = spec.required.filter(key => !(key in value));
    if (missingKeys.length > 0) {
      errors.push(makeError(cursor, value, `Value is missing required keys [${missingKeys.toString()}]`));
    }
  }

  for (const prop in spec.properties) {
    const param = spec.properties[prop];
    const value = value[prop];
    const newCursor = `${cursor}.${prop}`;
    param.name = prop;
    valueValidator(newCursor, value, param, errors, setDefault);
  }
}

// Exports

module.exports = type;
