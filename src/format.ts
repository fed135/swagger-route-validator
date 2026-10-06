import { makeError } from './error.ts';
import { isIPv4, isIPv6 } from 'node:net';

const DATE_TIME = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(-)?(.[0-9:]+)?(Z)?$/);
const DATE = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/);
const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i);
const EMAIL = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

const formatMap = {
  int8,
  int16,
  int32,
  int64,
  'double': finiteNumber,
  'float': finiteNumber,
  date,
  'date-time': dateTime,
  uuid,
  uri,
  ipv4,
  ipv6,
  email,
};

// -- Atoms
export function format(cursor, value, expectation, errors) {
  if (!(expectation in formatMap)) {
    throw new Error(`Invalid field format value ${expectation}, pattern must be one of ${Object.keys(formatMap)}`);
  }

  formatMap[expectation](cursor, value, errors, expectation);
  return errors;
}

// data formats
function int64(cursor, value, errors) {
  // Bounds exceed MAX_SAFE_INTEGER
  if (!Number.isInteger(value)) {
    errors.push(makeError(cursor, value, 'Value does not match int64 format'));
  }
}

function finiteNumber(cursor, value, errors, format) {
  if (!Number.isFinite(value)) {
    errors.push(makeError(cursor, value, `Value does not match ${format} format`));
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
  if (!DATE_TIME.test(value)) {
    errors.push(makeError(cursor, value, `Value does not match ISO date-time (RFC 3339 date-time) pattern ex: 1970-12-31T23:59:60Z`));
  }
}

function date(cursor, value, errors) {
  if (!DATE.test(value)) {
    errors.push(makeError(cursor, value, `Value does not match ISO date-time (RFC 3339 full-date) pattern ex: 1970-12-31`));
  }
}

function uuid(cursor, value, errors) {
  if (!UUID.test(value)) {
    errors.push(makeError(cursor, value, `Value does not match UUID pattern`));
  }
}

function uri(cursor, value, errors) {
  if (!URL.canParse(value)) {
    errors.push(makeError(cursor, value, `Value does not match URI pattern`));
  }
}

function ipv4(cursor, value, errors) {
  if (!isIPv4(value)) {
    errors.push(makeError(cursor, value, `Value does not match ipv4 pattern`));
  }
}

function ipv6(cursor, value, errors) {
  if (!isIPv6(value)) {
    errors.push(makeError(cursor, value, `Value does not match ipv6 pattern`));
  }
}

function email(cursor, value, errors) {
  if (!EMAIL.test(value)) {
    errors.push(makeError(cursor, value, `Value does not match email pattern`));
  }
}
