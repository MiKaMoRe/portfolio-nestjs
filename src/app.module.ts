import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PrismaModule } from './prisma/prisma.module.js';
import { GqlContext } from './common/context.js';
import { LoggingPlugin } from './common/plugins/logging.js';
import { Request, Response } from 'express';
import { LoaderRegistry } from './common/loaders/loaders.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [],
      inject: [],
      useFactory: () => ({
        autoSchemaFile: 'schema.gql',
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
        playground: false,
        context: ({
          req,
          res,
        }: {
          req: Request;
          res: Response;
        }): GqlContext => ({
          req,
          res,
          loaders: new LoaderRegistry(),
        }),
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  providers: [LoggingPlugin],
})
export class AppModule {}
