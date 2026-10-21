import { validateValue } from './valueValidator.ts';

export * from './middleware.ts';
export * from './response.ts';
export * from './request.ts';

export function validate(schema: Schema, value: any, fullSpec: Spec = { openapi: '3.2.1', info: { title: '', version: '0.0.0' } }, coerce = true) {
  return validateValue('', value, schema, () => {}, { errors: [], fullSpec, coerce });
}
