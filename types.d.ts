type ParameterType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'file';

interface Spec {
  swagger?: string
  openapi?: string
  schemes?: string[]
  host?: string
  basePath?: string
  info: {
    title: string;
    version: string;
    description: string;
    [customField: string]: string
  }
  consumes?: MediaType[]
  produces?: MediaType[]
  servers?: string[]
  securityDefinitions?: any
  parameters?: {
    [parameterName: string]: Parameter;
  }
  definitions?: {
    [definitionName: string]: SchemaFormatConstraints;
  }
  paths: {
    [route: string]: PathDefinition
  }
  webhooks: {
    [webhookName: string]: PathDefinition
  }
}

interface PathDefinition {
  get?: RouteDefinition
  put?: RouteDefinition
  post?: RouteDefinition
  delete?: RouteDefinition
  patch?: RouteDefinition
  parameters?: Parameter[]
}

interface RouteDefinition {
  summary?: string
  description?: string
  requestBody: Schema
  responses?: {
    default?: Schema | ResponseParameter;
    [statusCode: number]: Schema | ResponseParameter;
  }
  operationId?: string
  parameters?: Parameter[]
}

interface ResponseParameter {
  description?: string;
  content?: {
    [mediaType: MediaType]: { schema: Schema}
  }
}

type MediaType = 'application/json' | 'binary';

type BaseParameter = {
name: string;
in: 'body' | 'query' | 'path' | 'header' | 'formData' | 'body';
required?: boolean | undefined;
description?: string | undefined;
};

type BodyParameter = BaseParameter & {
in: 'body';
schema?: Schema | undefined;
};

type GenericFormat = {
type?: ParameterType | undefined;
format?: string | undefined;
};

type IntegerFormat = {
type: 'integer';
format?: 'int32' | 'int64' | undefined;
};

type NumberFormat = {
type: 'number';
format?: 'float' | 'double' | undefined;
};

type StringFormat = {
type: 'string';
format?: '' | 'byte' | 'binary' | 'date' | 'date-time' | 'password' | undefined;
};

type SchemaFormatConstraints = GenericFormat | IntegerFormat | NumberFormat | StringFormat;
type BaseFormatContrainedParameter = BaseParameter & SchemaFormatConstraints;
type ParameterCollectionFormat = 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi';

type QueryParameter = BaseFormatContrainedParameter &
BaseSchema & {
in: 'query';
allowEmptyValue?: boolean | undefined;
collectionFormat?: ParameterCollectionFormat | undefined;
};

type PathParameter = BaseFormatContrainedParameter &
BaseSchema & {
in: 'path';
required: true;
};

type HeaderParameter = BaseFormatContrainedParameter &
BaseSchema & {
in: 'header';
};

type FormDataParameter = BaseFormatContrainedParameter &
BaseSchema & {
in: 'formData';
type: ParameterType | 'file';
allowEmptyValue?: boolean | undefined;
collectionFormat?: ParameterCollectionFormat | undefined;
};

type Parameter = BodyParameter | FormDataParameter | QueryParameter | PathParameter | HeaderParameter;

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
route?: {
  url: string
}
method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
}

interface ResponseValidationOptions {
  behavior?: 'warn' | 'error'
}

interface ExpressResponse {
  req: ExpressRequest
  get: (headerName: string) => string
  statusCode: integer
}

declare module 'swagger-route-validator' {
  export function validateRequest(routeSpec: PathDefinition | RouteDefinition, req: Partial<ExpressRequest>, spec?: Spec): Errors[]
  export function validateResponse(routeSpec: PathDefinition | RouteDefinition, body: any, res: Partial<ExpressResponse>, spec?: Spec): Errors[]
  export function expressRequestValidation(routeSpec: PathDefinition | RouteDefinition, spec?: Spec): Errors[]
  export function expressResponseValidation(routeSpec: PathDefinition | RouteDefinition, options?: ResponseValidationOptions, spec?: Spec): Errors[]    
}
