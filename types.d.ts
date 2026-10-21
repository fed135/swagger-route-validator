type SupportedParameterTypes = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'file' | 'any';
type SupportedStringFormats = 'byte' | 'binary' | 'password' | 'date' | 'date-time' | 'uuid' | 'uri' | 'ipv4' | 'ipv6' | 'email';
type SupportedFloatingFormats = 'double' | 'float';
type SupportedIntegerFormats = 'int8' | 'int16' | 'int32' | 'int64';
type SupportedNumericFormats = SupportedFloatingFormats | SupportedIntegerFormats;
type SupportedLocations = 'query' | 'path' | 'header' | 'cookie';
type SupportedOASVersions = '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3' | '3.0.4' | '3.1.0' | '3.1.1' | '3.2.0' | '3.2.1';
type SupportedMediaTypes = 'application/json';
type SupportedHTTPVerbs = 'get' | 'post' | 'patch' | 'put' | 'delete' | 'query' | 'head';

interface Spec {
  openapi: SupportedOASVersions
  schemes?: string[]
  host?: string
  basePath?: string
  info: {
    title: string
    version: string
    description?: string
    contact?: MetaURLField
    license?: MetaURLField
    [customField: string]: any
  }
  termsOfService?: string
  consumes?: SupportedMediaTypes[]
  produces?: SupportedMediaTypes[]
  servers?: MetaURLField[]
  securityDefinitions?: any
  externalDocs?: MetaURLField
  tags?: MetaTagField[]
  parameters?: Record<string, Parameter>
  definitions?: Record<string, SchemaFormatConstraints>
  paths?: Record<string, PathDefinition>
  webhooks?: Record<string, PathDefinition>
}

interface MetaURLField {
  name: string
  url: string
  [customField: string]: string
}

interface MetaTagField {
  name: string
  summary?: string
  description?: string
  externalDocs?: MetaURLField
  parent?: string
  kind?: string
}

type PathDefinition = Record<SupportedHTTPVerbs, RouteDefinition>;

interface RouteDefinition {
  summary?: string
  description?: string
  requestBody?: {
    description?: string
    required?: boolean
    content: Record<SupportedMediaTypes, Schema>
  }
  responses?: {
    default?: Schema | ResponseParameter
    [statusCode: number]: Schema | ResponseParameter
  }
  operationId?: string
  parameters?: Parameter[]
  security?: any
  tags?: string[]
  deprecated?: boolean
}

interface ResponseParameter {
  summary?: string
  description?: string
  content?: Record<SupportedMediaTypes, Schema>
}

type BaseParameter = {
  name: string
  in: SupportedLocations
  description?: string
  required?: boolean
};

type GenericFormat = {
  type?: SupportedParameterTypes
  format?: string
};

type IntegerFormat = {
  type: 'integer'
  format?: SupportedIntegerFormats
};

type NumberFormat = {
  type: 'number'
  format?: SupportedFloatingFormats
};

type StringFormat = {
  type: 'string'
  format?: SupportedStringFormats
};

type SchemaFormatConstraints = GenericFormat | IntegerFormat | NumberFormat | StringFormat;
type BaseFormatContrainedParameter = BaseParameter & SchemaFormatConstraints;
type ParameterCollectionFormat = 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi';

type QueryParameter = BaseFormatContrainedParameter
  & Schema & {
    in: 'query' | 'querystring'
    allowEmptyValue?: boolean
    collectionFormat?: ParameterCollectionFormat
  };

type PathParameter = BaseFormatContrainedParameter
  & Schema & {
    in: 'path'
  };

type HeaderParameter = BaseFormatContrainedParameter
  & Schema & {
    in: 'header'
  };

type CookieParameter = BaseFormatContrainedParameter
  & Schema & {
    in: 'cookie'
  };

type Parameter = QueryParameter | PathParameter | HeaderParameter | CookieParameter;

type BaseSchema = {
  type?: SupportedParameterTypes
  format?: SupportedNumericFormats | SupportedStringFormats
  title?: string
  description?: string
  default?: any
  multipleOf?: number
  maximum?: number
  minimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  maxProperties?: number
  minProperties?: number
  enum?: any[]
  items?: Schema
};

interface Schema extends BaseSchema {
  $ref?: string
  allOf?: Schema[]
  oneOf?: Schema[]
  anyOf?: Schema[]
  not?: Schema
  additionalProperties?: Schema | boolean
  properties?: Record<string, Schema>
  discriminator?: string
  readOnly?: boolean
  example?: any
  required?: string[]
  nullable?: boolean
  schema?: Schema
}

interface Errors {
  error: string
  cursor: string
}

interface ExpressRequest {
  route?: {
    url: string
  }
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'QUERY'
}

interface ExpressResponse {
  req: ExpressRequest
  get: (headerName: string) => string
  statusCode: number
}

declare module 'swagger-route-validator' {
  export function validateRequest(routeSpec: PathDefinition | RouteDefinition, req: Partial<ExpressRequest>, spec?: Spec, coerce?: boolean): Errors[];
  export function validateResponse(routeSpec: PathDefinition | RouteDefinition, body: any, res: Partial<ExpressResponse>, spec?: Spec): Errors[];
  export function validate(schema: Schema, value: any, fullSpec?: Spec, coerce?: boolean): Errors[];
  export function expressRequestValidation(routeSpec: PathDefinition | RouteDefinition, spec?: Spec, coerce?: boolean): (req: Partial<ExpressRequest>, res: Partial<ExpressResponse>, next: () => void) => any;
  export type OpenApiSpecification = Spec;
}
