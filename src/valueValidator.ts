import {format} from './format';
import {makeError} from './error';

const propertyMap = {
  format,
  pattern,
  enum: enumeration,
  minimum,
  maximum,
  exclusiveMinimum,
  exclusiveMaximum,
  maxItems: () => {},
  minItems: () => {},
  maxProperties: () => {},
  minProperties: () => {},
  minLength,
  maxLength,
  multipleOf,
  $not: isNot,
  $allOf: isAllOf,
  $anyOf: isAnyOf,
  $oneOf: isOneOf,
};

export function set(req) {
  return (cursor, value) => {
    const keys = cursor.split('.');
    const last = keys.pop();

    if (keys[0] === 'path') return; // Fix for req.path in Express 5

    keys.reduce((o, k) => (o[k] || {}), req)[last] = value;
  };
}

export function scanRef(path: string, spec: any) {
  // Check if the path is for an external reference
  const target = (path[0] !== '#') ? require(path.substring(0, path.indexOf('#') || path.length)) : spec;
  const pathTokens = path.substring(path.indexOf('#') + 1).split('/');
  return pathTokens.reduce((cursor, token) => token !== '' ? cursor?.[token] || null : cursor, target);
}

export function validateValue(cursor, value, spec, setDefault, errors, fullSpec = {}) {
  if (value !== undefined && value !== null) {
    if (spec.schema) {
      Object.assign(spec, spec.schema);
      if (!spec.type) spec.type = 'object';
    }

    if (spec.$ref) {
      const refName = spec.$ref;
      const refKey = refName.split('/').slice(-1)[0];
      spec = scanRef(refName, fullSpec);

      if (!spec) {
        return errors.push(makeError(cursor, value, `Could not find definition for ${refName}`));
      }

      cursor += `:${refKey}`;
    }

    type(cursor, value, spec.type, spec, setDefault, errors);

    for (const prop in propertyMap) {
      if (spec[prop] !== undefined) {
        propertyMap[prop](cursor, value, spec[prop], errors);
      }
    }
  }
  else {
    if (spec.required === true || (spec.required === undefined && spec.default === undefined && spec.nullable != true)) {
      errors.push(makeError(cursor, value, `Value for ${spec.name} is required and was not provided`));
    }
    if (spec.default !== undefined) {
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

function exclusiveMinimum(cursor, value, expectation, errors) {
  if (value <= expectation) {
    errors.push(makeError(cursor, value, `Value is smaller or equal the minimum: ${expectation}`));
  }
}

function exclusiveMaximum(cursor, value, expectation, errors) {
  if (value >= expectation) {
    errors.push(makeError(cursor, value, `Value is larger or equal the maximum: ${expectation}`));
  }
}

function enumeration(cursor, value, expectation, errors) {
  if (!expectation.includes(value)) {
    errors.push(makeError(cursor, value, `Value is not one of: [${expectation.toString()}]`));
  }
}

function minLength(cursor, value, expectation, errors) {
  if (value.length < expectation) {
    errors.push(makeError(cursor, value, `Value has does not match minimum length: ${expectation}`));
  }
}

function maxLength(cursor, value, expectation, errors) {
  if (value.length > expectation) {
    errors.push(makeError(cursor, value, `Value has does not match maximum length: ${expectation}`));
  }
}

function multipleOf(cursor, value, expectation, errors) {
  if (value % expectation !== 0) {
    errors.push(makeError(cursor, value, `Value is not a multiple of: ${expectation}`));
  }
}

function isNot(cursor, value, expectation, errors) {
  const { items, numErrors } = runAssertions(value, expectation);

  if (numErrors.length !== items.length) {
    errors.push(makeError(cursor, value, `Value was found in $not statement ${expectation}`));
  }
}

function isAnyOf(cursor, value, expectation, errors) {
  const { items, numErrors } = runAssertions(value, expectation);

  if (items.length - numErrors.length < 1) {
    errors.push(makeError(cursor, value, `Value did not match $anyOf statement ${expectation}`));
  }
}

function isAllOf(cursor, value, expectation, errors) {
  const { numErrors } = runAssertions(value, expectation);

  if (numErrors.length !== 0) {
    errors.push(makeError(cursor, value, `Value did not match $allOf statement ${expectation}`));
  }
}

function isOneOf(cursor, value, expectation, errors) {
  const { items, numErrors } = runAssertions(value, expectation);

  if (items.length - numErrors.length !== 1) {
    errors.push(makeError(cursor, value, `Value did not match $oneOf statement ${expectation}`));
  }
}

function runAssertions(value, expectation) {
  const items = (Array.isArray(expectation) ? expectation : [expectation]);
  const numErrors = items.map(item => validateValue('', value, item, () => {}, []).length > 0).filter(item => !!item); // Length = number of errors

  return { items, numErrors };
}

export function type(cursor, value, expectation, spec, setDefault, errors) {
  switch (expectation) {
    case 'string':
      string(cursor, value, setDefault, errors);
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
    case 'any':
      break;
    default:
      throw new Error(`Invalid field type value ${expectation} in ${JSON.stringify(spec)} at ${cursor}`);
  }
  return errors;
}

// data types

function string(cursor, value, setDefault, errors) {
  if (typeof value !== 'string') {
    errors.push(makeError(cursor, value, 'Value is not a string'));
  }
  else {
    setDefault(cursor, value);
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
  if (typeof value === 'string') value = value.split(',');

  if (!Array.isArray(value)) return errors.push(makeError(cursor, value, 'Value is not an array'));

  if (spec.minItems !== undefined && value.length < spec.minItems) return errors.push(makeError(cursor, value, `Value does not meet the minimum number of items ${spec.minItems}`));
  if (spec.maxItems !== undefined && value.length > spec.maxItems) return errors.push(makeError(cursor, value, `Value exceeds the maximum number of items ${spec.maxItems}`));
  const param = spec.items || { type: 'any' };
  for (let i = 0; i < value.length; i++) {
    const newCursor = `${cursor}[${i}]`;
    param.name = 'items';
    validateValue(newCursor, value[i], param, setDefault, errors);
  }
}

function object(cursor, value, spec, setDefault, errors) {
  if (typeof value !== 'object' || Array.isArray(value)) return errors.push(makeError(cursor, value, 'Value is not an object'));

  let count = 0;
  for (let key in value) ++count;
  if (spec.maxProperties !== null && count > spec.maxProperties) return errors.push(makeError(cursor, value, `Value has more properties than maximum: ${spec.maxProperties}`));
  if (spec.minProperties !== null && count < spec.minProperties) return errors.push(makeError(cursor, value, `Value has fewer properties than minimum: ${spec.minProperties}`));

  if (spec.required !== undefined && spec.required.length) {
    const missingKeys = spec.required.filter(key => !(key in value));
    if (missingKeys.length > 0) {
      return errors.push(makeError(cursor, value, `Value is missing required keys [${missingKeys.toString()}]`));
    }
  }

  if (spec.additionalProperties === false) {
    for (const prop in value) {
      if (!(prop in spec.properties)) return errors.push(makeError(cursor, value, `Unexpected key ${prop} in object, additionalProperties not permitted`));
    }
  }

  for (const prop in spec.properties) {
    const param = spec.properties[prop];
    const newCursor = `${cursor}.${prop}`;
    param.name = prop;
    validateValue(newCursor, value[prop], param, setDefault, errors);
  }
}
