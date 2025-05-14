import {validateRequest} from './request';
import {validateResponse} from './response';

export function expressRequestValidation(routeSpec, spec?) {
    return function SRVRequestValidation(req, res, next) {
        const errors = validateRequest(routeSpec, req, spec);
        if (errors.length > 0) throw new Error(`Request object does not match the specification for this route: ${JSON.stringify(errors)}`);

        next();
    }
}

interface ResponseValidationOptions {
    behavior?: 'warn' | 'error'
}

export function expressResponseValidation(routeSpec, options?: ResponseValidationOptions, spec?) {
    if (Object.keys(routeSpec.responses).length < 1) throw new Error('Body cannot be validated because it does not have any defined responses');

    if (!options.behavior) options.behavior = 'error';
    if (options.behavior !== 'error' && options.behavior !== 'warn') throw new Error(`Unknown value "${options.behavior}" for behavior option`);

    return function SRVResponseValidation(req, res, next) {
        var oldSend = res.send;

        res.send = function(data) {
            // Check status code
            if (!routeSpec.responses[res.statusCode] && !routeSpec.responses['default']) {
                throw new Error(`Response status code "${res.statusCode}" not present in spec for this route and no default responses could be found.`);
            }

            const responseObj = routeSpec.responses[res.statusCode] || routeSpec.responses['default'];

            const errors = validateResponse(responseObj.content ? responseObj.content['application/json'] : responseObj, JSON.parse(data), spec);
            if (errors.length > 0) {
                const errorMessage = `Response object does not match the specification for this route: ${JSON.stringify(errors)}`;
                if (options.behavior === 'warn') console.log(errorMessage);
                else throw new Error(errorMessage);
            }

            oldSend.apply(res, arguments);
        }
        next();
    }
}
