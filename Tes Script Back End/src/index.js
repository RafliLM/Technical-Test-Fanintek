import Express from "express"
import authController from "./controllers/auth.controller.js"
import epresenceController from "./controllers/epresence.controller.js"
import errorHandler from "./middlewares/error.middleware.js"
import BodyParser from "body-parser"
import cors from "cors"
import authMiddleware from "./middlewares/auth.middleware.js"

const app = Express()

const port = process.env.PORT | 5000

const bodyParser = BodyParser.json()

app.use(cors())

app.use(bodyParser)

app.use("/auth", authController)

app.use("/epresence", [authMiddleware], epresenceController)

app.use(errorHandler)

app.listen(port, () => console.log(`App running on port ${port}!`))