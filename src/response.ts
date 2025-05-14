import { validateValue, set } from './valueValidator';

export function validateResponse(routeSpec, response, spec:any = {}) {
    const errors = [];

    validateValue('', response, routeSpec, set(response), errors, spec.definitions, spec.parameters);
  
  return errors;
}
