import type { ErrorAccumulator } from './error.ts';
import { isIPv4, isIPv6 } from 'node:net';
import { domainToASCII } from 'node:url';

const DATE_TIME = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(-)?(.[0-9:]+)?(Z)?$/);
const DATE = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/);
const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i);
const EMAIL = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

// RFC 3339 time
const DATE_FULL_SRC = '[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])';
const TIME_PARTIAL_SRC = '(?:[01][0-9]|2[0-3]):[0-5][0-9]:(?:[0-5][0-9]|60)(?:\\.[0-9]+)?'; // 60 = leap second
const TIME_OFFSET_SRC = '(?:[Zz]|[+-](?:[01][0-9]|2[0-3]):[0-5][0-9])';
const TIME = new RegExp(`^${TIME_PARTIAL_SRC}${TIME_OFFSET_SRC}$`);
const TIME_LOCAL = new RegExp(`^${TIME_PARTIAL_SRC}$`);
const DATE_TIME_LOCAL = new RegExp(`^${DATE_FULL_SRC}[Tt]${TIME_PARTIAL_SRC}$`);

// RFC 3339 Appendix A duration
const DUR_TIME_SRC = 'T(?:[0-9]+H(?:[0-9]+M(?:[0-9]+S)?)?|[0-9]+M(?:[0-9]+S)?|[0-9]+S)';
const DUR_DATE_SRC = `(?:[0-9]+D|[0-9]+M(?:[0-9]+D)?|[0-9]+Y(?:[0-9]+M(?:[0-9]+D)?)?)(?:${DUR_TIME_SRC})?`;
const DURATION = new RegExp(`^P(?:${DUR_DATE_SRC}|${DUR_TIME_SRC}|[0-9]+W)$`);

// RFC 7231 HTTP-date: IMF-fixdate, plus the obsolete rfc850 / asctime forms
const HTTP_TIME_SRC = '(?:[01][0-9]|2[0-3]):[0-5][0-9]:(?:[0-5][0-9]|60)';
const MONTH_SRC = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)';
const HTTP_DATE = new RegExp(
  '^(?:'
  + `(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (?:0[1-9]|[12][0-9]|3[01]) ${MONTH_SRC} [0-9]{4} ${HTTP_TIME_SRC} GMT`
  + '|'
  + `(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (?:0[1-9]|[12][0-9]|3[01])-${MONTH_SRC}-[0-9]{2} ${HTTP_TIME_SRC} GMT`
  + '|'
  + `(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) ${MONTH_SRC} (?:0[1-9]|[12][0-9]|3[01]| [1-9]) ${HTTP_TIME_SRC} [0-9]{4}`
  + ')$',
);

// hostnames / email
const HOSTNAME = /^(?=.{1,253}$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;
const IDN_EMAIL_LOCAL = /^[\p{L}\p{N}\p{M}.!#$%&'*+/=?^_`{|}~-]+$/u;

// decimals / integers carried as strings
const DECIMAL_STRING = /^-?[0-9]+(?:\.[0-9]+)?$/;
const DECIMAL128_STRING = /^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;
const UINT_STRING = /^(?:0|[1-9][0-9]*)$/;
const UNIXTIME_STRING = /^-?[0-9]+(?:\.[0-9]+)?$/;
const UINT64_MAX = 2n ** 64n - 1n;
const INT64_STRING = /^(?:0|-?[1-9][0-9]*)$/;
const INT64_MIN = -(2n ** 63n);
const INT64_MAX = 2n ** 63n - 1n;

// JSON pointers (RFC 6901)
const JSON_POINTER = /^(?:\/(?:[^~/]|~[01])*)*$/;
const RELATIVE_JSON_POINTER = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~[01])*)*)$/;

// URI / IRI references
const SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:/;
const FORBIDDEN_REFERENCE_CHARS = /[\u0000-\u0020\u007f"<>\\^`{|}]/;
const INVALID_PERCENT_ENCODING = /%(?![0-9A-Fa-f]{2})/;
const NON_ASCII = /[^\u0000-\u007f]/;
const REFERENCE_BASE = 'http://base.invalid/';

// RFC 6570 URI Template
const VARCHAR_SRC = '(?:[A-Za-z0-9_]|%[0-9A-Fa-f]{2})';
const VARSPEC_SRC = `${VARCHAR_SRC}(?:\\.?${VARCHAR_SRC})*(?::[1-9][0-9]{0,3}|\\*)?`;
const URI_TEMPLATE_EXPRESSION_SRC = `\\{[+#./;?&=,!@|]?${VARSPEC_SRC}(?:,${VARSPEC_SRC})*\\}`;
const URI_TEMPLATE_LITERAL_SRC = '(?:[^\\x00-\\x20"\'%<>\\\\^`{|}\\x7f]|%[0-9A-Fa-f]{2})';
const URI_TEMPLATE = new RegExp(`^(?:${URI_TEMPLATE_LITERAL_SRC}|${URI_TEMPLATE_EXPRESSION_SRC})*$`);

// RFC 5646 / BCP 47 language tags (well-formedness only)
const LANGTAG_SRC
  = '(?:[a-z]{2,3}(?:-[a-z]{3}){0,3}|[a-z]{4}|[a-z]{5,8})' // language [extlang]
    + '(?:-[a-z]{4})?' // script
    + '(?:-(?:[a-z]{2}|[0-9]{3}))?' // region
    + '(?:-(?:[a-z0-9]{5,8}|[0-9][a-z0-9]{3}))*' // variants
    + '(?:-[0-9a-wy-z](?:-[a-z0-9]{2,8})+)*' // extensions
    + '(?:-x(?:-[a-z0-9]{1,8})+)?'; // private use
const GRANDFATHERED_SRC
  = 'en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|'
    + 'sgn-BE-FR|sgn-BE-NL|sgn-CH-DE|'
    + 'art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min-nan|zh-min|zh-xiang';
const LANGUAGE = new RegExp(`^(?:${LANGTAG_SRC}|x(?:-[a-z0-9]{1,8})+|${GRANDFATHERED_SRC})$`, 'i');

// RFC 9110 media-range ("*" is a tchar, so "*/*" and "type/*" are covered by token/token)
const TOKEN_SRC = '[!#$%&\'*+.^_`|~0-9A-Za-z-]+';
const QUOTED_STRING_SRC = '"(?:[\\t \\x21\\x23-\\x5b\\x5d-\\x7e\\x80-\\xff]|\\\\[\\t \\x21-\\x7e\\x80-\\xff])*"';
const MEDIA_RANGE = new RegExp(
  `^${TOKEN_SRC}/${TOKEN_SRC}(?:[ \\t]*;[ \\t]*(?:${TOKEN_SRC}=(?:${TOKEN_SRC}|${QUOTED_STRING_SRC}))?)*$`,
);

// RFC 8941 structured field bare items (serialized form)
const SF_BINARY = /^:[A-Za-z0-9+/]*={0,2}:$/; // padding is lenient per RFC 8941 §4.2.7
const SF_BOOLEAN = /^\?[01]$/;
const SF_STRING = /^"(?:[\x20\x21\x23-\x5b\x5d-\x7e]|\\["\\])*"$/;
const SF_TOKEN = /^[A-Za-z*][!#$%&'*+.^_`|~0-9A-Za-z:/-]*$/;

const noop = () => {};

const stringFormatMap = {
  'base64url': noop,
  'byte': noop,
  'binary': noop,
  'commonmark': noop,
  'html': noop,
  'password': noop,
  char,
  date,
  'date-time': dateTime,
  'date-time-local': dateTimeLocal,
  'decimal': decimalString,
  'decimal128': decimal128String,
  duration,
  email,
  hostname,
  'http-date': httpDate,
  'idn-email': idnEmail,
  'idn-hostname': idnHostname,
  'int64': int64String,
  'ipv4-cidr': ipv4Cidr,
  ipv4,
  'ipv6-cidr': ipv6Cidr,
  ipv6,
  'iri-reference': iriReference,
  iri,
  'json-pointer': jsonPointer,
  language,
  'media-range': mediaRange,
  regex,
  'relative-json-pointer': relativeJsonPointer,
  'sf-binary': sfBinary,
  'sf-boolean': sfBoolean,
  'sf-string': sfString,
  'sf-token': sfToken,
  time,
  'time-local': timeLocal,
  'uint64': uint64String,
  'unixtime': unixtimeString,
  'uri-reference': uriReference,
  'uri-template': uriTemplate,
  uri,
  uuid,
} satisfies Record<SupportedStringFormats, (value: string, failIf: ErrorAccumulator) => void>;

const numberFormatMap = {
  int8,
  int16,
  int32,
  int64,
  uint8,
  uint16,
  uint32,
  'uint64': uint64Number,
  'double': finiteNumber,
  'float': finiteNumber,
  'decimal': finiteNumber,
  'decimal128': finiteNumber,
  'unixtime': finiteNumber,
  'double-int': doubleInt,
  'sf-integer': sfInteger,
  'sf-decimal': sfDecimal,
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

function isReference(value: string, allowNonAscii: boolean): boolean {
  return !FORBIDDEN_REFERENCE_CHARS.test(value)
    && !INVALID_PERCENT_ENCODING.test(value)
    && (allowNonAscii || !NON_ASCII.test(value))
    && URL.canParse(value, REFERENCE_BASE);
}

function isCidr(value: string, isAddress: (address: string) => boolean, maxPrefix: number): boolean {
  const slash = value.indexOf('/');
  const prefix = value.slice(slash + 1);
  return slash >= 0
    && isAddress(value.slice(0, slash))
    && /^(?:0|[1-9][0-9]{0,2})$/.test(prefix)
    && Number(prefix) <= maxPrefix;
}

function isIdnHostname(value: string): boolean {
  const ascii = value.length > 0 ? domainToASCII(value) : '';
  return ascii !== '' && HOSTNAME.test(ascii);
}

function isIdnEmail(value: string): boolean {
  const at = value.lastIndexOf('@');
  return at > 0 && IDN_EMAIL_LOCAL.test(value.slice(0, at)) && isIdnHostname(value.slice(at + 1));
}

function isDecimal128(value: string): boolean {
  const [mantissa = ''] = value.split(/[eE]/);
  const significantDigits = mantissa.replace(/^[+-]/, '').replace('.', '').replace(/^0+/, '');
  return DECIMAL128_STRING.test(value) && significantDigits.length <= 34;
}

function isRegex(value: string): boolean {
  try {
    // No "u" flag on purpose: real-world specs routinely rely on legacy (Annex B) escapes
    new RegExp(value);
    return true;
  }
  catch {
    return false;
  }
}

function isInt64String(value: string): boolean {
  if (!INT64_STRING.test(value)) {
    return false;
  }
  const parsed = BigInt(value);
  return parsed >= INT64_MIN && parsed <= INT64_MAX;
}

// -- string data formats

function dateTime(value: string, failIf: ErrorAccumulator) {
  failIf(!DATE_TIME.test(value), `Value does not match ISO date-time (RFC 3339 date-time) pattern ex: 1970-12-31T23:59:59Z`);
}

function date(value: string, failIf: ErrorAccumulator) {
  failIf(!DATE.test(value), `Value does not match ISO date-time (RFC 3339 full-date) pattern ex: 1970-12-31`);
}

function dateTimeLocal(value: string, failIf: ErrorAccumulator) {
  failIf(!DATE_TIME_LOCAL.test(value), `Value does not match RFC 3339 date-time without offset pattern ex: 1970-12-31T23:59:59`);
}

function time(value: string, failIf: ErrorAccumulator) {
  failIf(!TIME.test(value), `Value does not match RFC 3339 full-time pattern ex: 23:59:59Z`);
}

function timeLocal(value: string, failIf: ErrorAccumulator) {
  failIf(!TIME_LOCAL.test(value), `Value does not match RFC 3339 time without offset pattern ex: 23:59:59`);
}

function duration(value: string, failIf: ErrorAccumulator) {
  failIf(!DURATION.test(value), `Value does not match RFC 3339 duration pattern ex: P3Y6M4DT12H30M5S`);
}

function httpDate(value: string, failIf: ErrorAccumulator) {
  failIf(!HTTP_DATE.test(value), `Value does not match HTTP-date pattern ex: Sun, 06 Nov 1994 08:49:37 GMT`);
}

function uuid(value: string, failIf: ErrorAccumulator) {
  failIf(!UUID.test(value), `Value does not match UUID pattern`);
}

function uri(value: string, failIf: ErrorAccumulator) {
  failIf(!URL.canParse(value), `Value does not match URI pattern`);
}

function uriReference(value: string, failIf: ErrorAccumulator) {
  failIf(!isReference(value, false), `Value does not match URI reference pattern`);
}

function iri(value: string, failIf: ErrorAccumulator) {
  failIf(!(SCHEME.test(value) && isReference(value, true)), `Value does not match IRI pattern`);
}

function iriReference(value: string, failIf: ErrorAccumulator) {
  failIf(!isReference(value, true), `Value does not match IRI reference pattern`);
}

function uriTemplate(value: string, failIf: ErrorAccumulator) {
  failIf(!URI_TEMPLATE.test(value), `Value does not match URI Template (RFC 6570) pattern`);
}

function jsonPointer(value: string, failIf: ErrorAccumulator) {
  failIf(!JSON_POINTER.test(value), `Value does not match JSON Pointer (RFC 6901) pattern ex: /foo/0`);
}

function relativeJsonPointer(value: string, failIf: ErrorAccumulator) {
  failIf(!RELATIVE_JSON_POINTER.test(value), `Value does not match relative JSON Pointer pattern ex: 1/foo`);
}

function ipv4(value: string, failIf: ErrorAccumulator) {
  failIf(!isIPv4(value), `Value does not match ipv4 pattern`);
}

function ipv6(value: string, failIf: ErrorAccumulator) {
  failIf(!isIPv6(value), `Value does not match ipv6 pattern`);
}

function ipv4Cidr(value: string, failIf: ErrorAccumulator) {
  failIf(!isCidr(value, isIPv4, 32), `Value does not match ipv4-cidr pattern ex: 192.168.0.0/16`);
}

function ipv6Cidr(value: string, failIf: ErrorAccumulator) {
  // node's isIPv6 accepts zone ids (fe80::1%eth0), which are not valid in CIDR notation
  failIf(!isCidr(value, address => !address.includes('%') && isIPv6(address), 128), `Value does not match ipv6-cidr pattern ex: 2001:db8::/32`);
}

function hostname(value: string, failIf: ErrorAccumulator) {
  failIf(!HOSTNAME.test(value), `Value does not match hostname (RFC 1123) pattern`);
}

function idnHostname(value: string, failIf: ErrorAccumulator) {
  failIf(!isIdnHostname(value), `Value does not match idn-hostname (RFC 5890) pattern`);
}

function email(value: string, failIf: ErrorAccumulator) {
  failIf(!EMAIL.test(value), `Value does not match email pattern`);
}

function idnEmail(value: string, failIf: ErrorAccumulator) {
  failIf(!isIdnEmail(value), `Value does not match idn-email pattern`);
}

function char(value: string, failIf: ErrorAccumulator) {
  failIf(Array.from(value).length !== 1, `Value does not match char format (exactly one character)`);
}

function language(value: string, failIf: ErrorAccumulator) {
  failIf(!LANGUAGE.test(value), `Value does not match language tag (RFC 5646) pattern ex: en-CA`);
}

function mediaRange(value: string, failIf: ErrorAccumulator) {
  failIf(!MEDIA_RANGE.test(value), `Value does not match media-range pattern ex: text/*;q=0.8`);
}

function regex(value: string, failIf: ErrorAccumulator) {
  failIf(!isRegex(value), `Value does not match regex (ECMA-262) format`);
}

function decimalString(value: string, failIf: ErrorAccumulator) {
  failIf(!DECIMAL_STRING.test(value), `Value does not match decimal format`);
}

function decimal128String(value: string, failIf: ErrorAccumulator) {
  failIf(!isDecimal128(value), `Value does not match decimal128 format (at most 34 significant digits)`);
}

function unixtimeString(value: string, failIf: ErrorAccumulator) {
  failIf(!UNIXTIME_STRING.test(value), `Value does not match unixtime format`);
}

// the string form exists because the range exceeds MAX_SAFE_INTEGER
function uint64String(value: string, failIf: ErrorAccumulator) {
  failIf(!UINT_STRING.test(value) || BigInt(value) > UINT64_MAX, `Value does not match uint64 format`);
}

// the string form exists because the range exceeds MAX_SAFE_INTEGER
function int64String(value: number, failIf: ErrorAccumulator) {
  failIf(!isInt64String(value), `Value does not match int64 format`);
}

// RFC 8941 structured field bare items, in serialized form (:base64:, "text", ?1, token)
function sfBinary(value: string, failIf: ErrorAccumulator) {
  failIf(!SF_BINARY.test(value), `Value does not match sf-binary format ex: :cHJldGVuZA==:`);
}

function sfBoolean(value: string, failIf: ErrorAccumulator) {
  failIf(!SF_BOOLEAN.test(value), `Value does not match sf-boolean format (?0 or ?1)`);
}

function sfString(value: string, failIf: ErrorAccumulator) {
  failIf(!SF_STRING.test(value), `Value does not match sf-string format ex: "hello world"`);
}

function sfToken(value: string, failIf: ErrorAccumulator) {
  failIf(!SF_TOKEN.test(value), `Value does not match sf-token format ex: foo123/456`);
}

// -- number data formats

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
  failIf((!Number.isInteger(value) || value > 0x7f || value < -0x80), 'Value does not match int8 format');
}

function uint32(value: number, failIf: ErrorAccumulator) {
  failIf(!Number.isInteger(value) || value < 0 || value > 0xffffffff, 'Value does not match uint32 format');
}

function uint16(value: number, failIf: ErrorAccumulator) {
  failIf(!Number.isInteger(value) || value < 0 || value > 0xffff, 'Value does not match uint16 format');
}

function uint8(value: number, failIf: ErrorAccumulator) {
  failIf(!Number.isInteger(value) || value < 0 || value > 0xff, 'Value does not match uint8 format');
}

function uint64Number(value: number, failIf: ErrorAccumulator) {
  failIf(!Number.isInteger(value) || value < 0 || value >= 2 ** 64, 'Value does not match uint64 format');
}

function doubleInt(value: number, failIf: ErrorAccumulator) {
  failIf(!Number.isSafeInteger(value), 'Value does not match double-int format');
}

// RFC 8941 integer: up to 15 digits
function sfInteger(value: number, failIf: ErrorAccumulator) {
  failIf(!Number.isInteger(value) || Math.abs(value) > 999999999999999, 'Value does not match sf-integer format');
}

// RFC 8941 decimal: up to 12 integer digits and 3 fractional digits
function sfDecimal(value: number, failIf: ErrorAccumulator) {
  failIf(!Number.isFinite(value) || Math.abs(value) >= 1e12 || Number(value.toFixed(3)) !== value, 'Value does not match sf-decimal format');
}
