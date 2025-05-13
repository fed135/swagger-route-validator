import {validateRequest} from './request';
import {validateResponse} from './response';

export function expressRequestValidation(spec) {
    // Verify spec integrity

    return function SRVRequestValidation(req, res, next) {

    }
}

export function expressResponseValidation(spec) {
    // Verify spec integrity

    return function SRVResponseValidation(req, res, next) {
        var oldSend = res.send;

        res.send = function(data){
            // Validate

            oldSend.apply(res, arguments);
        }
        next();
    }
}
