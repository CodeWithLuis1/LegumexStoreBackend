export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly key: string,
        public readonly params?: Record<string, unknown>
    ) {
        super(key)
        this.name = this.constructor.name
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, id: number | string) {
        super(404, "errors.not_found", { resource, id })
    }
}
