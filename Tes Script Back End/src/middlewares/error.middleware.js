import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library"
import { BadRequestError } from "../errors/badrequest.error.js"
import { AuthenticationError } from "../errors/authentication.error.js"
import { AuthorizationError } from "../errors/authorization.error.js"
import jwt from "jsonwebtoken"

export default async (err, req, res, next) => {
    if (err instanceof BadRequestError) {
        return res.status(400).json({
            success: false,
            message: err.message,
            errors: err.errors
        })
    }
    if (err instanceof AuthenticationError) {
        return res.status(401).json({
            success: false,
            message: err.message
        })
    }
    if (err instanceof AuthorizationError) {
        return res.status(403).json({
            success: false,
            message: err.message
        })
    }
    if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
            success: false,
            message: "Session habis, silahkan melakukan login kembali!"
        })
    }
    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code == 'P2025') {
            return res.status(404).json({
                success: false,
                message: err.message
            })
        }
        if (err.code == 'P2002') {
            console.log(err)
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }
    return res.status(500).json({
        success: false,
        message: err.message
    })
}