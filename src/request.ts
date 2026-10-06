import { validateValue, set } from './valueValidator.ts';

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

    const parent = paramLocation === 'body' ? {} : (req[paramLocation]?.[param.name] ? req[paramLocation] : req.params);
    const value = (paramLocation === 'body' ? req.body : parent?.[param.name]) || undefined;
    const cursor = paramLocation === 'body' ? 'body' : `${paramLocation}.${param.name}`;

    validateValue(cursor, value, param, (c, v) => parent[param.name] = v, errors, spec);
  }
}
