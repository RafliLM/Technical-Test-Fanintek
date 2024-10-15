export class AuthorizationError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
    }
}