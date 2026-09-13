import { Otp } from "../models/Otp.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import { generateOtp } from "../utils/helper.js"
import transporter from "../services/emailService.js"

export const verifyOtp = async (request, response) => {

    const { otp, email } = request.body

    try {
        if (!email || !otp) {
            response.status(404).send({ message: "Email and OTP are required" })
            return
        }

        const data = await Otp.findOne({ email })

        if (!data) {
            response.status(400).send({ message: "OTP not found" })
            return
        }

        const isMatch = await bcrypt.compare(otp.toString(), data.otp);

        if (!isMatch) {
            response.status(400).send({ message: "Invalid OTP" })
            return
        }

        const otpToken = jwt.sign({
            email: data.email
        },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        )

        response.cookie("otpToken", otpToken, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true
        })

        await Otp.deleteMany({ email })

        response.status(200).json({ message: "OTP Verified", data: data, success: true })
    } catch (error) {
        console.error("Error Otp verification", error)
    }
}


export const resendOtp = async (request, response) => {

    const { email } = request.body

    try {
        if (!email) {
            response.status(400).send({ message: "Please fill all the fields" })
            return
        }

        const user = await Otp.findOne({ email })

        if (!user) {
            response.status(400).send({ message: "user not found" })
            return
        }

        const newOtp = generateOtp();

        const otpHash = await bcrypt.hash(newOtp, 10)

        const isValid = await bcrypt.compare(newOtp, otpHash)
        if (!isValid) {
            response.status(400).send({ message: "Invalid OTP" })
            return
        }

        const data = await Otp.findOneAndUpdate(
            { email: email },
            { otp: otpHash },
            { new: true }
        )

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            id: user.id,
            subject: "Resend OTP For Email Verification",
            html: `<h1>Your new OTP IS ${newOtp}</h1>`
        }

        await transporter.sendMail(mailOptions)

        response.status(200).json({ message: "New OTP has been Sended To Your Email", success: true, data: user })

    } catch (error) {
        console.error("Error resending otp", error)
    }
}

export default { verifyOtp, resendOtp }
