import { accumulator } from './error.ts';
import type { SRVError } from './error.ts';
import { validateValue } from './valueValidator.ts';
import type { Context } from './valueValidator.ts';

const noop = () => {};

export function validateRequest(routeSpec: RouteDefinition, req: Request, spec: Spec = { openapi: '3.2.1', info: { title: '', version: '0.0.0' } }, coerce = true): SRVError[] {
  const context: Context = { errors: [], fullSpec: spec, coerce };

  if (routeSpec.parameters) validateParameters(routeSpec.parameters, req, context);

  if (routeSpec.requestBody?.content) {
    const currentMediaType = req.headers?.['Content-Type'] ?? 'application/json';
    if (currentMediaType !== 'application/json') throw new Error(`Unable to parse Content-Type ${currentMediaType}. Must be "application/json"`);

    if (!routeSpec.requestBody?.content?.['application/json']) return [{ cursor: 'body', error: 'application/json requestBody definition is not defined' }];

    validateValue('body', req.body, routeSpec.requestBody.content['application/json'], noop, context);
  }
  return context.errors;
}

function validateParameters(parameters: RouteDefinition['parameters'], req: Request, context: Context) {
  const cookies = parameters.some(i => i.in === 'cookie') ? parseCookies(req.header.get('cookie') ?? '') : {};

  for (let i = 0; i < parameters.length; i++) {
    const pLoc: SupportedLocations = parameters[i].in;
    const pName: string = parameters[i].name;

    if (!pLoc || !pName) throw new Error(`Unable to validate parameter ${i}, missing name or location`);
    const failIf = accumulator(`${pLoc}.${pName}`, context.errors);

    switch (pLoc) {
      case 'cookie':
        if (cookies[pName] === undefined) {
          failIf(parameters[i].required === true, `Value is required and was not provided`);
          break;
        }
        validateValue(`cookie.${pName}`, cookies[pName], parameters[i].schema, noop, context);
        break;
      case 'header':
        if (req.header.get(pName) === null) {
          failIf(parameters[i].required === true, `Value is required and was not provided`);
          break;
        }
        validateValue(`header.${pName}`, req.header.get(pName), parameters[i].schema, noop, context);
        break;
      case 'path':
        if (failIf(req.params?.[pName] === undefined, `Value is required and was not provided`)) break;
        validateValue(`path.${pName}`, req.params[pName], parameters[i].schema, context.coerce ? v => req.params[pName] = v : noop, context);
        break;
      case 'query':
        if (req.query?.[pName] === undefined) {
          failIf(parameters[i].required === true, `Value is required and was not provided`);
          break;
        }
        validateValue(`query.${pName}`, req.query?.[pName], parameters[i].schema, context.coerce ? v => req.query ? req.query[pName] = v : req.query = { [pName]: v } : noop, context);
        break;
      default:
        throw new Error(`Invalid parameter location value ${pLoc}`);
    }
  }
}

const parseCookies = (value: string) => Object.fromEntries(value.split(';').map((cookie) => {
  const [key, ...content] = cookie.split('=');
  return [key.trim(), decodeURIComponent(content.join('='))];
}));
