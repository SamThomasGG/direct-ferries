import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { HttpStatus, type Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { z, type ZodObject, type ZodRawShape, type ZodTypeAny } from 'zod';

const ErrorSchema = extendApi(
  z.object({
    statusCode: extendApi(z.number(), { description: 'HTTP status code' }),
    message: extendApi(z.string(), { description: 'Error message' }),
  }),
  { description: 'Error response' },
);

class ErrorDto extends createZodDto(ErrorSchema) {}

type ZodDtoClass = Type & { zodSchema: ZodObject<ZodRawShape> };

function getZodType(schema: ZodTypeAny): 'string' | 'number' | 'boolean' {
  const typeName = schema._def.typeName;
  if (typeName === 'ZodNumber') return 'number';
  if (typeName === 'ZodBoolean') return 'boolean';
  return 'string';
}

function unwrapSchema(schema: ZodTypeAny): ZodTypeAny {
  const typeName = schema._def.typeName;
  if (
    typeName === 'ZodOptional' ||
    typeName === 'ZodDefault' ||
    typeName === 'ZodEffects'
  ) {
    return unwrapSchema(schema._def.innerType || schema._def.schema);
  }
  return schema;
}

function extractQueryParams(queryType: ZodDtoClass) {
  const shape = queryType.zodSchema.shape;
  const params: {
    name: string;
    required: boolean;
    type: 'string' | 'number' | 'boolean';
    description?: string;
    example?: unknown;
    enum?: string[];
  }[] = [];

  for (const [name, fieldSchema] of Object.entries(shape)) {
    const schema = fieldSchema as ZodTypeAny;
    const unwrapped = unwrapSchema(schema);
    const openApi = (schema as { _def: { openapi?: Record<string, unknown> } })
      ._def.openapi;

    const isOptional =
      schema._def.typeName === 'ZodOptional' ||
      schema._def.typeName === 'ZodDefault';

    const param: (typeof params)[0] = {
      name,
      required: !isOptional,
      type: getZodType(unwrapped),
      description: openApi?.description as string | undefined,
      example: openApi?.example,
    };

    if (unwrapped._def.typeName === 'ZodEnum') {
      param.enum = unwrapped._def.values;
    }

    params.push(param);
  }

  return params;
}

interface ApiEndpointOptions {
  summary: string;
  description?: string;
  responseType?: Type;
  queryType?: ZodDtoClass;
  isArray?: boolean;
}

export function ApiEndpoint({
  summary,
  description,
  responseType,
  queryType,
  isArray = false,
}: ApiEndpointOptions) {
  const decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [
    ApiOperation({
      summary,
      description: description || summary,
    }),
  ];

  if (queryType) {
    const params = extractQueryParams(queryType);
    for (const param of params) {
      decorators.push(
        ApiQuery({
          name: param.name,
          description: param.description,
          required: param.required,
          type: param.type,
          example: param.example,
          enum: param.enum,
        }),
      );
    }
  }

  decorators.push(
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request',
      type: ErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid API key',
      type: ErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Rate limit exceeded (100 requests/min)',
      type: ErrorDto,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Server error',
      type: ErrorDto,
    }),
  );

  if (responseType) {
    decorators.push(ApiExtraModels(responseType));
    decorators.push(
      ApiResponse({
        status: HttpStatus.OK,
        description: `${summary} - Success`,
        schema: isArray
          ? { type: 'array', items: { $ref: getSchemaPath(responseType) } }
          : { $ref: getSchemaPath(responseType) },
      }),
    );
  }

  return applyDecorators(...decorators);
}
