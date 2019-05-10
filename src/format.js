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
  }
}

// data formats

function int64(cursor, value, errors) {
  if (value >= 0x7fffffffffffffff || value < -0x7fffffffffffffff) {
    errors.push(makeError(cursor, value, 'Value does not match int64 format'));
  }
}

function int32(cursor, value, errors) {
  if (value >= 0x7fffffff || value < -0x7fffffff) {
    errors.push(makeError(cursor, value, 'Value does not match int32 format'));
  }
}

function int16(cursor, value, errors) {
  if (value >= 0x7fff || value < -0x7fff) {
    errors.push(makeError(cursor, value, 'Value does not match int16 format'));
  }
}

function int8(cursor, value, errors) {
  if (value >= 0x7f || value < -0x7f) {
    errors.push(makeError(cursor, value, 'Value does not match int16 format'));
  }
}

function dateTime(cursor, value, errors) {
  const result = new RegExp(/[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}T[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}Z/).exec(value);
  if (result === null) {
    errors.push(makeError(cursor, value, `Value does not match date-time (RFC 3339) pattern /[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}T[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}Z/`));
  }
}

// Exports

module.exports = format;
