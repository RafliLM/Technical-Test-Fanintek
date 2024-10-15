export class BadRequestError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
    }
}