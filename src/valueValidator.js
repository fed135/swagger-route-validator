const type = require('./type');
const format = require('./format');
const makeError = require('./error');

function validateValue(cursor, value, spec, setDefault, errors) {
  if (value !== undefined) {

    type(cursor, value, spec.type, spec, errors);

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


// Exports

module.exports = validateValue;
