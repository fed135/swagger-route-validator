import {validateRequest} from './request.ts';

class expressError {
    message = ''
    statusCode = 0
    status = 0
    title = ''

    constructor(message: string, statusCode: number, title: string) {
        this.message = message;
        this.statusCode = statusCode;
        this.status = statusCode;
        this.title = title;
    }

}

export function expressRequestValidation(routeSpec, spec?) {
    return function SRVRequestValidation(req, res, next) {
        if (!req.route) throw new Error('Request validation was added to a non-route middleware.');

        const errors = validateRequest(routeSpec, req, spec);
        if (errors.length > 0) {
            const errorObj = new expressError(`Request object does not match the specification for this route: ${JSON.stringify(errors)}`, 400, 'Bad Request');
            Object.setPrototypeOf(errorObj, Error.prototype);
            throw errorObj;
        }
        next();
    }
}
