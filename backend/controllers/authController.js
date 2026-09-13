import bcrypt, { hash } from "bcrypt"
import { User } from "../models/User.js"
import jwt from "jsonwebtoken"
import { Otp } from "../models/Otp.js"
import { loginSchema, registerSchema } from "../validations/user.validations.js"
import { error } from "console"

export const registerUser = async (request, response) => {

    const { error, value } = registerSchema.validate(request.body)
    if (error) {
        response.status(400).json(error.details[0].message)
    }

    try {

        const { name, email, password } = value

        if (!name || !email || !password) {
            response.status(400).send({ message: "Please Fill all The Fields" })
            return
        }

        const res = await User.findOne({ email })

        if (res) {
            response.status(400).send({ message: "Sorry a user with this email already exist" })
            return
        }

        const encryptedPassword = await bcrypt.hash(password, 10)

        const data = await User.create({
            name: name,
            email: email,
            password: encryptedPassword
        })

        response.status(200).json({ message: "signup sucessfully", data, sucess: true })

    } catch (error) {
        console.error("Error creating user", error)
    }
}

export const loginUser = async (request, response) => {

    const { error, value } = loginSchema.validate(request.body)
    if (error) {
        response.status(400).json(error.details[0].message)
    }

    try {
        const { email, password } = value

        if (!email || !password) {
            response.status(400).send({ message: "Please Fill all the fields" })
            return
        }

        const user = await User.findOne({ email })

        if (!user) {
            response.status(400).send({ message: "user not found" })
            return
        }

        const IsPasswordValid = await bcrypt.compare(password, user.password)
        if (!IsPasswordValid) {
            response.status(400).send({ message: "invalid password" })
            return
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );

        response.status(200).json({ message: "Login Sucessfull", user, token })
    } catch (error) {
        return response.json({ sucess: false, message: error.message })
    }
}

export const getProfile = async (request, response) => {
    try {
        const user = await User.findById(request.user.id).select("-password")

        if (!user) {
            response.status(400).send({ message: "user not found", error })
        }
        response.status(200).json({ message: "Get profile sucessfully", user })

    } catch (error) {
        console.error("Error while get profile", error)
    }
}


export default { registerUser, loginUser, getProfile }