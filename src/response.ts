import { validateValue, set } from './valueValidator';

export function validateResponse(routeSpec, response, res, spec:any = {}) {
    const errors = [];

    if (!routeSpec.responses[res.statusCode] && !routeSpec.responses['default']) {
      throw new Error(`Response status code "${res.statusCode}" not present in spec for this route and no default responses could be found.`);
    }
    
    const responseObj = routeSpec.responses[res.statusCode] || routeSpec.responses[(`${res.statusCode}`[0])+'XX'] || routeSpec.responses['default'];
    
    validateValue('', response, routeSpec[res.req?.method?.toLowerCase()] || responseObj.content ? responseObj.content['application/json'] : responseObj, set(response), errors, spec);
    if (responseObj.headers) {
      for (let h in responseObj.headers) {
          validateValue(`header.${h}`, res.get(h), { name: h, ...responseObj.headers[h]}, () => {}, errors, {});
      }
  }
  
  return errors;
}
