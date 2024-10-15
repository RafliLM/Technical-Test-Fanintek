import prisma from "../utils/prisma.js"
import jwt from "jsonwebtoken"
import { hashSync, compare } from "bcrypt"
import { AuthenticationError } from "../errors/authentication.error.js"

const SECRET_KEY = process.env.SECRET_KEY

export default {
    signUp: async (data) => {
        if (data.npp_supervisor) {
            await prisma.user.findUniqueOrThrow({
                where: {
                    npp: data.npp_supervisor
                }
            })
        }
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                npp: data.npp,
                npp_supervisor: data.npp_supervisor,
                password: hashSync(data.password, 10)
            }
        })
        return "Berhasil melakukan signUp!"
    },
    signIn: async (data) => {
        const { password, ...user } = await prisma.user.findUniqueOrThrow({
            where: {
                email: data.email
            }
        })
        if (!await compare(data.password, password))
            throw new AuthenticationError("Password salah!")
        const token = jwt.sign(user, SECRET_KEY, {
            expiresIn: '6h'
        })
        return token
    }
}