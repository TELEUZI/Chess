import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validateMiddleware = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      req.body = schema.parse(req.body);
      next();
    } catch (error: unknown) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
};
