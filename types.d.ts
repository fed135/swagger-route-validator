declare module 'swagger-route-validator' {

    export type ParameterType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'file';

    export interface Schema {
      parameters?: Parameter[]
      definitions?: {
        [String]: SchemaFormatConstraints
      }
    }

export type BaseParameter = {
  name: string;
  in: 'body' | 'query' | 'path' | 'header' | 'formData' | 'body';
  required?: boolean | undefined;
  description?: string | undefined;
};

export type BodyParameter = BaseParameter & {
  in: 'body';
  schema?: Schema | undefined;
};

export type GenericFormat = {
  type?: ParameterType | undefined;
  format?: string | undefined;
};

export type IntegerFormat = {
  type: 'integer';
  format?: 'int32' | 'int64' | undefined;
};

export type NumberFormat = {
  type: 'number';
  format?: 'float' | 'double' | undefined;
};

export type StringFormat = {
  type: 'string';
  format?: '' | 'byte' | 'binary' | 'date' | 'date-time' | 'password' | undefined;
};

export type SchemaFormatConstraints = GenericFormat | IntegerFormat | NumberFormat | StringFormat;
export type BaseFormatContrainedParameter = BaseParameter & SchemaFormatConstraints;
export type ParameterCollectionFormat = 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi';

export type QueryParameter = BaseFormatContrainedParameter &
  BaseSchema & {
    in: 'query';
    allowEmptyValue?: boolean | undefined;
    collectionFormat?: ParameterCollectionFormat | undefined;
  };

export type PathParameter = BaseFormatContrainedParameter &
  BaseSchema & {
    in: 'path';
    required: true;
  };

export type HeaderParameter = BaseFormatContrainedParameter &
  BaseSchema & {
    in: 'header';
  };

export type FormDataParameter = BaseFormatContrainedParameter &
  BaseSchema & {
    in: 'formData';
    type: ParameterType | 'file';
    allowEmptyValue?: boolean | undefined;
    collectionFormat?: ParameterCollectionFormat | undefined;
  };

export type Parameter = BodyParameter | FormDataParameter | QueryParameter | PathParameter | HeaderParameter;

    interface Reference {
        $ref: string;
      }
    // ------------------------------ Schema -------------------------------------
 type BaseSchema = {
    type?: ParameterType | undefined;
    format?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    default?: any;
    multipleOf?: number | undefined;
    maximum?: number | undefined;
    exclusiveMaximum?: boolean | undefined;
    minimum?: number | undefined;
    exclusiveMinimum?: boolean | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;
    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    maxProperties?: number | undefined;
    minProperties?: number | undefined;
    enum?: any[] | undefined;
    items?: Schema | Schema[] | undefined;
  };
  
   interface Schema extends BaseSchema {
    $ref?: string | undefined;
    allOf?: Schema[] | undefined;
    additionalProperties?: Schema | boolean | undefined;
    properties?: { [propertyName: string]: Schema } | undefined;
    discriminator?: string | undefined;
    readOnly?: boolean | undefined;
    example?: any;
    required?: string[] | undefined;
  }
  
  interface Errors {
    error: string
    cursor: string
  }

  interface ExpressRequest {

  }

  interface ExpressResponse {

  }
    

    export default function validate(spec: Schema, req: Partial<ExpressRequest>): Errors[]
    export function validateRequest(spec: Schema, req: Partial<ExpressRequest>): Errors[]
    export function validateResponse(spec: Schema, res: Partial<ExpressResponse>, body: any): Errors[]
    export function expressRequestValidation(spec: Schema): Errors[]
    export function expressResponseValidation(spec: Schema): Errors[]
}
