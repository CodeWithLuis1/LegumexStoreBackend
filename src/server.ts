import express from "express"
import cors from "cors"
import appRouter from "./routes"
import { errorHandler } from "./shared/middlewares/errorHandler"
import i18next, { i18nextMiddleware } from "./config/i18n"

const server = express()

server.set("trust proxy", 1)

server.use(cors({
    origin: "*",
}))

server.use(express.json({ limit: "20mb" }))

server.use(i18nextMiddleware.handle(i18next))

server.use("/api", appRouter)

server.get("/", (_req, res) => {
    res.json({ message: "Welcome to the Legumex Online Store API" })
})

server.use(errorHandler)

export default server
