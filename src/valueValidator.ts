import { createRequire } from 'node:module';
import { formatString, formatNumber } from './format.ts';
import { accumulator } from './error.ts';
import type { SRVError, ErrorAccumulator } from './error.ts';

const require = createRequire(import.meta.url);

const noop = () => {};

export type Context = {
  errors: SRVError[]
  fullSpec: Spec
  coerce: boolean
};

type AtomFunction<T, U> = (value: T, expectation: U, context: Context, failIf: ErrorAccumulator) => void;

const atoms = {
  // format             // Handled by parent
  pattern,
  enum: enumeration,
  minimum,
  maximum,
  exclusiveMinimum,
  exclusiveMaximum,
  // maxItems           // Handled by parent
  // minItems           // Handled by parent
  // maxProperties      // Handled by parent
  // minProperties      // Handled by parent
  minLength,
  maxLength,
  multipleOf,
  $not: isNot,
  $allOf: isAllOf,
  $anyOf: isAnyOf,
  $oneOf: isOneOf,
} satisfies Record<string, AtomFunction<any, any>>;

const regexpCache: { [key: string]: RegExp } = {};

export function lookupRef(path: string, spec: Spec) {
  // Check if the path is for an external reference
  const target = (path[0] !== '#') ? require(path.substring(0, path.indexOf('#') || path.length)) : spec;
  const pathTokens = path.substring(path.indexOf('#') + 1).split('/');
  return pathTokens.reduce((cursor, token) => token !== '' ? cursor?.[token] || null : cursor, target);
}

export function validateValue(cursor: string, value: any, spec: Partial<Schema>, setValue: (val: any) => void, context: Context): SRVError[] {
  const failIf: ErrorAccumulator = accumulator(cursor, context.errors);
  const missingValue = value === undefined || value === null;

  // traverse schema property
  if (spec.schema) {
    return validateValue(cursor, value, spec.schema, setValue, context);
  }

  // resolve Ref
  if (spec.$ref) {
    const refName = spec.$ref;
    const refKey = refName.slice(refName.lastIndexOf('/') + 1); ;
    const loadedSpec = lookupRef(refName, context.fullSpec);

    if (failIf(!loadedSpec, `Could not find definition for ${refName}`)) return context.errors;

    return validateValue(cursor + `:${refKey}`, value, loadedSpec, setValue, context);
  }

  // set default
  if (spec.default !== undefined && missingValue) {
    setValue(spec.default);
    value = spec.default;
  }

  // required
  if (failIf(spec.nullable !== true && missingValue && spec.default === undefined, `Value is required and was not provided`)) return context.errors;

  // nullable
  if (spec.nullable === true && missingValue) return context.errors;

  // typecheck and coersion
  type(cursor, value, spec.type || 'object', spec, context.coerce === true ? setValue : noop, context, failIf);

  // TODO: test coersion being reflected in following calls...

  // number formats
  if ((spec.type === 'integer' || spec.type === 'number') && spec.format) formatNumber(value, spec.format, failIf);

  // string formats
  if ((spec.type === 'string') && spec.format) formatString(value, spec.format, failIf);

  // atoms
  for (const prop in atoms) {
    if (spec.hasOwnProperty(prop)) {
      atoms[prop](value, spec[prop], context, failIf);
    }
  }

  return context.errors;
}

// atoms
function pattern(value: string, expectation: string, context: Context, failIf: ErrorAccumulator) {
  let validator = regexpCache[expectation];
  if (!validator) {
    validator = new RegExp(expectation);
    regexpCache[expectation] = validator;
  }

  failIf(!validator.test(value), `Value does not match pattern ${expectation}`);
}

function minimum(value: number, expectation: number, context: Context, failIf: ErrorAccumulator) {
  failIf(value < expectation, `Value is smaller than minimum: ${expectation}`);
}

function maximum(value: number, expectation: number, context: Context, failIf: ErrorAccumulator) {
  failIf(value > expectation, `Value is larger than minimum: ${expectation}`);
}

function exclusiveMinimum(value: number, expectation: number, context: Context, failIf: ErrorAccumulator) {
  failIf(value <= expectation, `Value is smaller or equal the minimum: ${expectation}`);
}

function exclusiveMaximum(value: number, expectation: number, context: Context, failIf: ErrorAccumulator) {
  failIf(value >= expectation, `Value is larger or equal the maximum: ${expectation}`);
}

function enumeration(value: string, expectation: string[], context: Context, failIf: ErrorAccumulator) {
  failIf(!expectation.includes(value), `Value is not one of: [${expectation.toString()}]`);
}

function minLength(value: string, expectation: number, context: Context, failIf: ErrorAccumulator) {
  failIf(value.length < expectation, `Value has does not match minimum length: ${expectation}`);
}

function maxLength(value: string, expectation: number, context: Context, failIf: ErrorAccumulator) {
  failIf(value.length > expectation, `Value has does not match maximum length: ${expectation}`);
}

function multipleOf(value: number, expectation: number, context: Context, failIf: ErrorAccumulator) {
  failIf(value % expectation !== 0, `Value is not a multiple of: ${expectation}`);
}

function isNot(value: any, expectation: any, context: Context, failIf: ErrorAccumulator) {
  const { items, numErrors } = runAssertions(value, expectation, context);

  failIf(numErrors.length !== items.length, `Value matches $not statement`);
}

function isAnyOf(value: any, expectation: any, context: Context, failIf: ErrorAccumulator) {
  const { items, numErrors } = runAssertions(value, expectation, context);

  failIf(items.length - numErrors.length < 1, `Value does not match $anyOf statement`);
}

function isAllOf(value: any, expectation: any, context: Context, failIf: ErrorAccumulator) {
  const { numErrors } = runAssertions(value, expectation, context);

  failIf(numErrors.length !== 0, `Value does not match $allOf statement`);
}

function isOneOf(value: any, expectation: any, context: Context, failIf: ErrorAccumulator) {
  const { items, numErrors } = runAssertions(value, expectation, context);

  failIf(items.length - numErrors.length !== 1, `Value does not match $oneOf statement`);
}

function runAssertions(value: any, expectation: any, context: Context) {
  const tempContext: Context = { errors: [], fullSpec: context.fullSpec, coerce: context.coerce };
  const items = (Array.isArray(expectation) ? expectation : [expectation]);
  const numErrors = items.map(item => validateValue('', value, item, noop, tempContext).length > 0).filter(item => !!item); // Length = number of errors

  return { items, numErrors };
}

// types
export function type(cursor: string, value: any, expectation: any, spec: Schema, setValue: (value: any) => void, context: Context, failIf: ErrorAccumulator) {
  switch (expectation) {
    case 'string':
      string(value, failIf);
      break;
    case 'integer':
      integer(value, setValue, failIf);
      break;
    case 'number':
      number(value, setValue, failIf);
      break;
    case 'boolean':
      boolean(value, setValue, failIf);
      break;
    case 'array':
      list(cursor, value, spec, setValue, context, failIf);
      break;
    case 'object':
      object(cursor, value, spec, setValue, context, failIf);
      break;
    case 'schema':
      object(cursor, value, spec, setValue, context, failIf);
      break;
    case 'any':
      break;
    default:
      throw new Error(`Invalid field type value ${expectation} in ${JSON.stringify(spec)} at ${cursor}`);
  }
}

function string(value: any, failIf: ErrorAccumulator) {
  failIf(typeof value !== 'string', 'Value is not a string');
}

function number(value: any, setValue: (value: any) => void, failIf: ErrorAccumulator) {
  const parsedValue = Number(value);
  if (!failIf(typeof parsedValue !== 'number' || Number.isNaN(parsedValue), 'Value is not a number')) setValue(parsedValue);
}

function integer(value: any, setValue: (value: any) => void, failIf: ErrorAccumulator) {
  const parsedValue = Number(value);
  if (!failIf(!Number.isInteger(parsedValue), 'Value is not an integer')) setValue(parsedValue);
}

function boolean(value: any, setValue: (value: any) => void, failIf: ErrorAccumulator) {
  if (value === 'true' || value === true) setValue(true);
  else if (value === 'false' || value === false) setValue(false);
  else failIf(true, 'Value is not a boolean');
}

function list(cursor: string, value: any, spec: Schema, setValue: (value: any) => void, context: Context, failIf: ErrorAccumulator) {
  const parsedValue = (typeof value === 'string') ? value.split(',') : value;

  if (failIf(!Array.isArray(parsedValue), 'Value is not an array')) return context.errors;

  if (!Array.isArray(value)) setValue(parsedValue);

  failIf(spec.minItems !== undefined && value.length < spec.minItems, `Value does not meet the minimum number of items ${spec.minItems}`);
  failIf(spec.maxItems !== undefined && value.length > spec.maxItems, `Value exceeds the maximum number of items ${spec.maxItems}`);

  const param = spec.items || { type: 'any' };
  for (let i = 0; i < value.length; i++) {
    validateValue(`${cursor}[${i}]`, value[i], param, v => value[i] = v, context);
  }
}

function object(cursor: string, value: any, spec: Schema, setValue: (value: any) => void, context: Context, failIf: ErrorAccumulator) {
  if (failIf(typeof value !== 'object' || Array.isArray(value), 'Value is not an object')) return context.errors;

  const props = Object.keys(value);
  failIf(props.length > (spec.maxProperties ?? 0xffff), `Value has more properties than maximum: ${spec.maxProperties ?? 0xffff}`);
  failIf(props.length < (spec.minProperties ?? 0), `Value has fewer properties than minimum: ${spec.minProperties ?? 0}`);

  if (spec.additionalProperties === false) {
    for (let i = 0; i < props.length; i++) {
      if (failIf(!(props[i] in spec.properties), `Unexpected key ${props[i]} in object, additionalProperties not permitted`)) return context.errors;
    }
  }

  if (spec.required?.length) {
    const missingKeys = spec.required.filter(key => !props.includes(key));
    if (failIf(missingKeys.length > 0, `Value is missing required keys [${missingKeys.toString()}]`)) return context.errors;
  }

  for (const prop in spec.properties) {
    validateValue(`${cursor}.${prop}`, value[prop], spec.properties[prop], v => value[prop] = v, context);
  }
}
