export class BadRequestError extends Error {
    constructor(message = "", errors, ...args) {
        super(message, ...args)
        this.errors = errors
    }
}