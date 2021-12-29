const makeError = require('./error');

// -- Atoms
function format(cursor, value, expectation, errors) {
  switch (expectation) {
  case 'int64':
    int64(cursor, value, errors);
    break;
  case 'int32':
    int32(cursor, value, errors);
    break;
  case 'int16':
    int16(cursor, value, errors);
    break;
  case 'int8':
    int8(cursor, value, errors);
    break;
  case 'date-time':
    dateTime(cursor, value, errors);
    break;
  default:
    throw new Error(`Invalid swagger field format value ${expectation}`);
  }
  return errors;
}

// data formats

function int64(cursor, value, errors) {
  // Bounds exceed MAX_SAFE_INTEGER
  if (!Number.isInteger(value)) {
    errors.push(makeError(cursor, value, 'Value does not match int64 format'));
  }
}

function int32(cursor, value, errors) {
  if (!Number.isInteger(value) || value > 0x7fffffff || value < -0x80000000) {
    errors.push(makeError(cursor, value, 'Value does not match int32 format'));
  }
}

function int16(cursor, value, errors) {
  if (!Number.isInteger(value) || value > 0x7fff || value < -0x8000) {
    errors.push(makeError(cursor, value, 'Value does not match int16 format'));
  }
}

function int8(cursor, value, errors) {
  if (!Number.isInteger(value) || value > 0x7f || value < -0x80) {
    errors.push(makeError(cursor, value, 'Value does not match int16 format'));
  }
}

function dateTime(cursor, value, errors) {
  const result = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(-)?(.[0-9:]+)?(Z)?$/).exec(value);
  if (result === null) {
    errors.push(makeError(cursor, value, `Value does not match ISO date-time (RFC 3339) pattern`));
  }
}

// Exports

module.exports = format;
