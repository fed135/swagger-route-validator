import { validateValue, set } from './valueValidator';

export function validateRequest(routeSpec, req, spec: any = {}, errors?: string[]) {
  errors = errors || [];

  if (routeSpec.parameters) validateParameters(routeSpec.parameters, req, spec, errors);

  if (errors.length > 0) return errors;

  if (routeSpec[req.method.toLowerCase()]) return validateRequest(routeSpec[req.method.toLowerCase()], req, spec, errors);

  if (routeSpec.requestBody && routeSpec.requestBody.content) validateValue('body', req.body, routeSpec.requestBody.content, set(req), errors, spec);

  return errors;
}

function validateParameters(parameters, req, spec, errors) {
    for (let i = 0; i < parameters.length; i++) {
      const param = parameters[i];
      const paramLocation = param.in === 'header' ? 'headers' : param.in;

      const value = paramLocation === 'body' ? req.body : (req[paramLocation] && req[paramLocation][param.name]) || (req.params && req.params[param.name]) || undefined;
      const cursor = paramLocation === 'body' ? 'body' : `${paramLocation}.${param.name}`;

      validateValue(cursor, value, param, set(req), errors, spec);
    }
}