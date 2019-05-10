const set = require('lodash.set');

function validate(spec, req) {
    const errors = [];
    
    for (let i = 0; i < spec.params.length; i++) {
        const param = spec.params[i];
        const value = param.in === 'body' ? req.body : req[param.in][param.name];
        const cursor = param.in === 'body' ? 'body' : `${param.in}.${param.name}`;
        examine(cursor, value, param);
    }

    return errors;


    function examine(cursor, obj, spec) {
        if (obj !== undefined) {
            type(cursor, obj, spec.type, spec);
            if (spec.format !== undefined) format(cursor, obj, spec.format);
            if (spec.pattern !== undefined) pattern(cursor, obj, spec.pattern);
            if (spec.enum !== undefined) enumeration(cursor, obj, spec.enum);
            if (spec.minimum !== undefined) minimum(cursor, obj, spec.minimum);
            if (spec.maximum !== undefined) maximum(cursor, obj, spec.maximum);
        }
        else {
            if (spec.required === true) pushError(cursor, obj, `Value for ${spec.name} is required and was not provided`);
            else {
                if (spec.default !== undefined) set(req, cursor, spec.default);
            }
        }
    }


    // -- Atoms

    function type(cursor, obj, expectation, spec) {
        switch(expectation) {
            case 'string': return string(cursor, obj);
            case 'integer': return integer(cursor, obj);
            case 'number': return number(cursor, obj);
            case 'boolean': return boolean(cursor, obj);
            case 'array': return list(cursor, obj, spec);
            case 'list': return list(cursor, obj, spec);
            case 'object': return object(cursor, obj, spec);
            case 'schema': return object(cursor, obj, spec);
        }
    }

    function format(cursor, obj, expectation) {
        switch(expectation) {
            case 'int64': return int64(cursor, obj);
            case 'int32': return int32(cursor, obj);
            case 'int16': return int16(cursor, obj);
            case 'int8': return int8(cursor, obj);
            case 'date-time': return dateTime(cursor, obj);
        }
    }

    function pattern(cursor, obj, expectation) {
        const result = new RegExp(expectation).exec(obj);
        if (result === null) pushError(cursor, obj, `Value does not match pattern ${expectation}`);
    }

    function minimum(cursor, obj, expectation) {
        if (obj < expectation) pushError(cursor, obj, `Value is smaller than minimum: ${expectation}`);
    }

    function maximum(cursor, obj, expectation) {
        if (obj > expectation) pushError(cursor, obj, `Value is larger than maximum: ${expectation}`);
    }

    function enumeration(cursor, obj, expectation) {
        if (!expectation.includes(obj)) pushError(cursor, obj, `Value is not one of: [${expectation.toString()}]`);
    }

    // data types

    function string(cursor, obj) {
        if (typeof obj !== 'string') pushError(cursor, obj, 'Value is not a string');
    }

    function number(cursor, obj) {
        if (typeof obj !== 'number') pushError(cursor, obj, 'Value is not a number');
    }

    function integer(cursor, obj) {
        if (!Number.isInteger(obj)) pushError(cursor, obj, 'Value is not an integer');
    }

    function boolean(cursor, obj) {
        if (obj !== true && obj !== false && obj !== 'true' && obj !== 'false') pushError(cursor, obj, 'Value is not a boolean');
    }

    function list(cursor, obj, spec) {
        if (typeof obj === 'string') obj = obj.split(',');
        
        if (spec.minItems !== undefined && obj.length < spec.minItems) pushError(cursor, obj, `Value does not meet the minimum number of items ${spec.minItems}`);
        if (spec.maxItems !== undefined && obj.length > spec.maxItems) pushError(cursor, obj, `Value exceeds the maximum number of items ${spec.maxItems}`);

        const param = spec.items;
        for (let i = 0; i < obj.length; i++) {
            const value = obj[i];
            const newCursor = `${cursor}[${i}]`;
            param.name = 'items';
            examine(newCursor, value, param);
        }
    }

    function object(cursor, obj, spec) {
        if (spec.required.length) {
            const missingKeys = spec.required.filter(key => !(key in obj));
            if (missingKeys.length > 0) pushError(cursor, obj, `Value is missing required keys [${missingKeys.toString()}]`);
        }
        for (const prop in spec.properties) {
            const param = spec.properties[prop];
            const value = obj[prop];
            const newCursor = `${cursor}.${prop}`;
            param.name = prop;
            examine(newCursor, value, param);
        }
    }

    // data formats

    function int64(cursor, obj) {
        if (obj >= 0x7fffffffffffffff || obj < -0x7fffffffffffffff) pushError(cursor, obj, 'Value does not match int64 format');
    }

    function int32(cursor, obj) {
        if (obj >= 0x7fffffff || obj < -0x7fffffff) pushError(cursor, obj, 'Value does not match int32 format');
    }

    function int16(cursor, obj) {
        if (obj >= 0x7fff || obj < -0x7fff) pushError(cursor, obj, 'Value does not match int16 format');
    }

    function int8(cursor, obj) {
        if (obj >= 0x7f || obj < -0x7f) pushError(cursor, obj, 'Value does not match int16 format');
    }

    function dateTime(cursor, obj) {
        const result = new RegExp(/[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}T[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}Z/).exec(obj);
        if (result === null) pushError(cursor, obj, `Value does not match date-time (RFC 3339) pattern /[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}T[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}Z/`);
    }

    // helpers

    function pushError(cursor, obj, error) {
        errors.push({
            error,
            cursor,
        });
    }
}

// Exports

module.exports = validate;
