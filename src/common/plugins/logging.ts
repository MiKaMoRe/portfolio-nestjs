import { Logger } from '@nestjs/common';
import { Plugin } from '@nestjs/apollo';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
  GraphQLRequestContext,
} from '@apollo/server';

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger('GraphQL');

  async requestDidStart(
    requestContext: GraphQLRequestContext<any>,
  ): Promise<GraphQLRequestListener<any>> {
    let req = requestContext.request;
    if (!req?.query || !req?.http) {
      return {};
    }

    const isIntrospection =
      req.query.includes('__schema') || req.query.includes('__type');
    if (isIntrospection) {
      return {};
    }

    this.logger.log('Incoming GraphQL Request', {
      query: req.query,
      method: req.http.method,
      variables: req.variables ? JSON.stringify(req.variables) : null,
    });
    return {};
  }
}
