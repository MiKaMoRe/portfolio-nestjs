import { Request, Response } from 'express';
import { Loaders } from './loaders/loaders.ts';

export interface GqlContext {
  req: Request;
  res: Response;
  loaders: Loaders;
}
