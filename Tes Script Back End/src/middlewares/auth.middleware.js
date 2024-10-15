import jwt from "jsonwebtoken"
import { Router } from "express"
import { AuthenticationError } from "../errors/authentication.error.js"

const authMiddleware = Router()

const SECRET_KEY = process.env.SECRET_KEY

authMiddleware.use(async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token)
            throw new AuthenticationError("Silahkan melakukan login terlebih dahulu!")
        const user = jwt.verify(token, SECRET_KEY)
        req.store = user
        return next()
    } catch (error) {
        return next(error)
    }  
})

export default authMiddleware