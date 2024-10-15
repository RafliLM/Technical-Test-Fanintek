export class AuthenticationError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
    }
}