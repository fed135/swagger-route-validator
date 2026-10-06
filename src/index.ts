import { validateValue } from './valueValidator.ts';

export * from './middleware.ts';
export * from './response.ts';
export * from './request.ts';

export function validate(schema, value, fullSpec?) {
  return validateValue('', value, schema, () => {}, [], fullSpec);
}
