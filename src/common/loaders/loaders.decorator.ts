import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { LoaderRegistry } from './loaders.js';
import { GqlContext } from '../context.js';

export function resolveLoader(context: ExecutionContext): LoaderRegistry {
  const { loaders } =
    GqlExecutionContext.create(context).getContext<GqlContext>();

  if (!loaders) {
    throw new Error('Loaders are not provided in the GraphQL context.');
  }

  return loaders;
}

export const Loader = createParamDecorator(
  (_: unknown, context: ExecutionContext) => resolveLoader(context),
);
