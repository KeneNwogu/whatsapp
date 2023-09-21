import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

import { RequestValidationError } from "../errors/request-validation-error";
// import log from "../entry-config/logger.config";

const ZodMiddleware =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try { 
      
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
    //   log.error(
    //     "Middleware Error: Request Validation Error. Errors: %o",
    //     error
    //   );
        console.log(error)
      const zErr = error as ZodError;
      
      throw new RequestValidationError(zErr); 
    }
  };

export default ZodMiddleware