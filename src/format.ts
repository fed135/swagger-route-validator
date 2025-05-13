import {makeError} from './error';
import { URL } from 'url';

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
    throw new Error(`Invalid swagger field format value ${expectation}, pattern must be one of ${Object.keys(formatMap)}`);
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
  const result = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(-)?(.[0-9:]+)?(Z)?$/).exec(value);
  if (result === null) {
    errors.push(makeError(cursor, value, `Value does not match ISO date-time (RFC 3339 date-time) pattern ex: 1970-12-31T23:59:60Z`));
  }
}

function date(cursor, value, errors) {
  const result = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/).exec(value);
  if (result === null) {
    errors.push(makeError(cursor, value, `Value does not match ISO date-time (RFC 3339 full-date) pattern ex: 1970-12-31`));
  }
}

function uuid(cursor, value, errors) {
  const result = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i).exec(value);
  if (result === null) {
    errors.push(makeError(cursor, value, `Value does not match UUID pattern`));
  }
}

function uri(cursor, value, errors) {
  try {
    return new URL(value);
  }
  catch (err) {
    errors.push(makeError(cursor, value, `Value does not match URI pattern`));
  }
}

function ipv4(cursor, value, errors) {
  const result = new RegExp(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/).exec(value);
  if (result === null) {
    errors.push(makeError(cursor, value, `Value does not match IPV4 pattern`));
  }
}

function ipv6(cursor, value, errors) {
  const result = new RegExp(/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/).exec(value);
  if (result === null) {
    errors.push(makeError(cursor, value, `Value does not match ipv6 pattern`));
  }
}

function email(cursor, value, errors) {
  const result = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/).exec(value);
  if (result === null) {
    errors.push(makeError(cursor, value, `Value does not match email pattern`));
  }
}
