import { validateValue, set } from './valueValidator';

export function validateRequest(routeSpec, req, spec: any = {}) {
  const errors = [];

  if (routeSpec.parameters) {
    for (let i = 0; i < routeSpec.parameters.length; i++) {
      const param = routeSpec.parameters[i];
      const paramLocation = param.in === 'header' ? 'headers' : param.in;

      const value = paramLocation === 'body' ? req.body : (req[paramLocation] && req[paramLocation][param.name]) || (req.params && req.params[param.name]) || undefined;
      const cursor = paramLocation === 'body' ? 'body' : `${paramLocation}.${param.name}`;

      validateValue(cursor, value, param, set(req), errors, spec.definitions, spec.parameters);
    }
  }
  return errors;
}
