import {validateRequest} from './request';
import {validateResponse} from './response';
import {validateValue} from './valueValidator';

function expressError(message, statusCode, title) {
    this.message = message;
    this.statusCode = statusCode;
    this.status = statusCode;
    this.title = title;
}

export function expressRequestValidation(routeSpec, spec?) {
    return function SRVRequestValidation(req, res, next) {
        if (!req.route) throw new Error('Request validation was added to a non-route middleware.');

        const errors = validateRequest(routeSpec, req, spec);
        if (errors.length > 0) {
            const errorObj = new expressError(`Request object does not match the specification for this route: ${JSON.stringify(errors)}`, 400, 'Bad Request');
            errorObj.prototype = Error.prototype;
            throw errorObj;
        }
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
            if (!res._validated) {
                res._validated = true;

                // Check status code
                if (!routeSpec.responses[res.statusCode] && !routeSpec.responses['default']) {
                    throw new Error(`Response status code "${res.statusCode}" not present in spec for this route and no default responses could be found.`);
                }

                const responseObj = routeSpec.responses[res.statusCode] || routeSpec.responses['default'];
                let errors;

                try {
                    errors = validateResponse(responseObj.content ? responseObj.content['application/json'] : responseObj, JSON.parse(data), spec);
                }
                catch(e) {
                    const errorObj = new expressError(`Response could not be parsed as JSON: ${JSON.stringify(e)}`, 422,  'Unprocessable Content');
                    errorObj.prototype = Error.prototype;
                    throw errorObj;
                }

                if (responseObj.headers) {
                    for (let h in responseObj.headers) {
                        validateValue(`header.${h}`, res.get(h), { name: h, ...responseObj.headers[h]}, () => {}, errors);
                    }
                }

                if (errors.length > 0) {
                    const errorMessage = `Response body does not match the specification for this route: ${JSON.stringify(errors)}`;
                    if (options.behavior === 'warn') console.log(errorMessage);
                    else {
                        const errorObj = new expressError(errorMessage, 422, 'Unprocessable Content');
                        errorObj.prototype = Error.prototype;
                        throw errorObj;
                    }
                }
            }

            oldSend.apply(res, arguments);
        }
        next();
    }
}
