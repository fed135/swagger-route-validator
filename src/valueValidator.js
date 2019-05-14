const format = require('./format');
const makeError = require('./error');

function validateValue(cursor, value, spec, setDefault, errors) {
  if (value !== undefined) {

    if (spec.schema) Object.assign(spec, spec.schema);
    type(cursor, value, spec.type, spec, setDefault, errors);

    if (spec.format) {
      format(cursor, value, spec.format, errors);
    }

    if (spec.pattern !== undefined) {
      pattern(cursor, value, spec.pattern, errors);
    }

    if (spec.enum !== undefined) {
      enumeration(cursor, value, spec.enum, errors);
    }

    if (spec.minimum !== undefined) {
      minimum(cursor, value, spec.minimum, errors);
    }

    if (spec.maximum !== undefined) {
      maximum(cursor, value, spec.maximum, errors);
    }

  } else {
    if (spec.required === true) {
      errors.push(makeError(cursor, value, `Value for ${spec.name} is required and was not provided`));

    } else if (spec.default !== undefined) {
      setDefault(cursor, spec.default);
    }
  }
  return errors;
}


// -- Atoms

function pattern(cursor, value, expectation, errors) {
  const result = new RegExp(expectation).exec(value);
  if (result === null) {
    errors.push(makeError(cursor, value, `Value does not match pattern ${expectation}`));
  }
}

function minimum(cursor, value, expectation, errors) {
  if (value < expectation) {
    errors.push(makeError(cursor, value, `Value is smaller than minimum: ${expectation}`));
  }
}

function maximum(cursor, value, expectation, errors) {
  if (value > expectation) {
    errors.push(makeError(cursor, value, `Value is larger than maximum: ${expectation}`));
  }
}

function enumeration(cursor, value, expectation, errors) {
  if (!expectation.includes(value)) {
    errors.push(makeError(cursor, value, `Value is not one of: [${expectation.toString()}]`));
  }
}

function type(cursor, value, expectation, spec, setDefault, errors) {
  switch (expectation) {
    case 'string':
      string(cursor, value, errors);
      break;
    case 'integer':
      integer(cursor, value, setDefault, errors);
      break;
    case 'number':
      number(cursor, value, setDefault, errors);
      break;
    case 'boolean':
      boolean(cursor, value, setDefault, errors);
      break;
    case 'array':
      list(cursor, value, spec, setDefault, errors);
      break;
    case 'list':
      list(cursor, value, spec, setDefault, errors);
      break;
    case 'object':
      object(cursor, value, spec, setDefault, errors);
      break;
    case 'schema':
      object(cursor, value, spec, setDefault, errors);
      break;
    default:
      throw new Error(`Invalid swagger field type value ${expectation} in ${JSON.stringify(spec)} at ${cursor}`);
  }
  return errors;
}

// data types

function string(cursor, value, errors) {
  if (typeof value !== 'string') {
    errors.push(makeError(cursor, value, 'Value is not a string'));
  }
}

function number(cursor, value, setDefault, errors) {
  const parsedValue = Number(value);
  if (typeof parsedValue !== 'number' || Number.isNaN(parsedValue)) {
    errors.push(makeError(cursor, value, 'Value is not a number'));
  }
  else {
    setDefault(cursor, parsedValue);
  }
}

function integer(cursor, value, setDefault, errors) {
  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue)) {
    errors.push(makeError(cursor, value, 'Value is not an integer'));
  }
  else {
    setDefault(cursor, parsedValue);
  }
}

function boolean(cursor, value, setDefault, errors) {
  if (value !== true && value !== false && value !== 'true' && value !== 'false') {
    errors.push(makeError(cursor, value, 'Value is not a boolean'));
  }
  else {
    setDefault(cursor, value === 'true');
  }
}

function list(cursor, value, spec, setDefault, errors) {
  if (typeof value === 'string' && value.indexOf(',') > -1) value = value.split(',');

  if (!Array.isArray(value)) return errors.push(makeError(cursor, value, 'Value is not an array'));
        
  if (spec.minItems !== undefined && value.length < spec.minItems) return errors.push(makeError(cursor, value, `Value does not meet the minimum number of items ${spec.minItems}`));
  if (spec.maxItems !== undefined && value.length > spec.maxItems) return errors.push(makeError(cursor, value, `Value exceeds the maximum number of items ${spec.maxItems}`));
  const param = spec.items;
  for (let i = 0; i < value.length; i++) {
    const newCursor = `${cursor}[${i}]`;
    param.name = 'items';
    validateValue(newCursor, value[i], param, setDefault, errors);
  }
}

function object(cursor, value, spec, setDefault, errors) {
  if (typeof value !== 'object' || Array.isArray(value)) return errors.push(makeError(cursor, value, 'Value is not an object'));

  if (spec.required !== undefined && spec.required.length) {
    const missingKeys = spec.required.filter(key => !(key in value));
    if (missingKeys.length > 0) {
      return errors.push(makeError(cursor, value, `Value is missing required keys [${missingKeys.toString()}]`));
    }
  }

  for (const prop in spec.properties) {
    const param = spec.properties[prop];
    const newCursor = `${cursor}.${prop}`;
    param.name = prop;
    validateValue(newCursor, value[prop], param, setDefault, errors);
  }
}

// Exports

module.exports = { type, validateValue };
