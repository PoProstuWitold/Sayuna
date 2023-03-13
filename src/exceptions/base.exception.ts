interface BaseExceptionOpts {
    name: string
    message: string
    status?: number
}

export class BaseError extends Error {
    status: number | undefined

    constructor(opts: BaseExceptionOpts) {
        super(opts.message)
        this.name = opts.name
        this.status = opts.status
    }
}