import { Request, Response, NextFunction, RequestHandler } from "express"
import { ZodType } from "zod"

type RequestLocation = "body" | "params" | "query"

export function validate(schema: ZodType, location: RequestLocation = "body"): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[location])
        if (!result.success) {
            next(result.error)
            return
        }
        req[location] = result.data
        next()
    }
}
