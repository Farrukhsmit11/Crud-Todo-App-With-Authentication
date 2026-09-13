import jwt from "jsonwebtoken"
import { User } from "../models/User.js"

const authMiddleware = async (request, response, next) => {
    try {
        const token = request.headers.authorization?.split(' ')[1]


        if (!token) {
            response.status(400).send({ message: "token is required" })
            return
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            response.status(400).send({ message: "user not found" })
            return
        }

        request.user = decoded
        next()
    } catch (error) {
        console.error("Error verifiying token", error)
    }
}

export default authMiddleware