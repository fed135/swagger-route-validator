import type { ErrorAccumulator } from './error.ts';
import { isIPv4, isIPv6 } from 'node:net';

const DATE_TIME = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(-)?(.[0-9:]+)?(Z)?$/);
const DATE = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/);
const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i);
const EMAIL = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

const noop = () => {};

const stringFormatMap = {
  'byte': noop,
  'binary': noop,
  'password': noop,
  date,
  'date-time': dateTime,
  uuid,
  uri,
  ipv4,
  ipv6,
  email,
} satisfies Record<SupportedStringFormats, (value: string, failIf: ErrorAccumulator) => void>;

const numberFormatMap = {
  int8,
  int16,
  int32,
  int64,
  double: finiteNumber,
  float: finiteNumber,
} satisfies Record<SupportedNumericFormats, (value: number, failIf: ErrorAccumulator, format: SupportedNumericFormats) => void>;

// -- Atoms
export function formatString(value: string, expectation: SupportedStringFormats, failIf: ErrorAccumulator) {
  if (!stringFormatMap.hasOwnProperty(expectation)) {
    throw new Error(`Invalid field format value ${expectation}, must be one of ${Object.keys(stringFormatMap)}`);
  }

  stringFormatMap[expectation](value, failIf);
}

export function formatNumber(value: number, expectation: SupportedNumericFormats, failIf: ErrorAccumulator) {
  if (!numberFormatMap.hasOwnProperty(expectation)) {
    throw new Error(`Invalid field format value ${expectation}, must be one of ${Object.keys(numberFormatMap)}`);
  }

  numberFormatMap[expectation](value, failIf, expectation);
}

// string data formats

function dateTime(value: string, failIf: ErrorAccumulator) {
  failIf(!DATE_TIME.test(value), `Value does not match ISO date-time (RFC 3339 date-time) pattern ex: 1970-12-31T23:59:60Z`);
}

function date(value: string, failIf: ErrorAccumulator) {
  failIf(!DATE.test(value), `Value does not match ISO date-time (RFC 3339 full-date) pattern ex: 1970-12-31`);
}

function uuid(value: string, failIf: ErrorAccumulator) {
  failIf(!UUID.test(value), `Value does not match UUID pattern`);
}

function uri(value: string, failIf: ErrorAccumulator) {
  failIf(!URL.canParse(value), `Value does not match URI pattern`);
}

function ipv4(value: string, failIf: ErrorAccumulator) {
  failIf(!isIPv4(value), `Value does not match ipv4 pattern`);
}

function ipv6(value: string, failIf: ErrorAccumulator) {
  failIf(!isIPv6(value), `Value does not match ipv6 pattern`);
}

function email(value: string, failIf: ErrorAccumulator) {
  failIf(!EMAIL.test(value), `Value does not match email pattern`);
}

// number data formats

function int64(value: number, failIf: ErrorAccumulator) {
  failIf(!Number.isInteger(value), 'Value does not match int64 format');
}

function finiteNumber(value: number, failIf: ErrorAccumulator, format: SupportedNumericFormats) {
  failIf(!Number.isFinite(value), `Value does not match ${format} format`);
}

function int32(value: number, failIf: ErrorAccumulator) {
  failIf((!Number.isInteger(value) || value > 0x7fffffff || value < -0x80000000), 'Value does not match int32 format');
}

function int16(value: number, failIf: ErrorAccumulator) {
  failIf((!Number.isInteger(value) || value > 0x7fff || value < -0x8000), 'Value does not match int16 format');
}

function int8(value: number, failIf: ErrorAccumulator) {
  failIf((!Number.isInteger(value) || value > 0x7f || value < -0x80), 'Value does not match int16 format');
}
