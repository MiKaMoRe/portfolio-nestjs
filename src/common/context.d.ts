import { Request, Response } from 'express';
import { LoaderRegistry } from './loaders/loaders.ts';

export interface GqlContext {
  req: Request;
  res: Response;
  loaders: LoaderRegistry;
}
