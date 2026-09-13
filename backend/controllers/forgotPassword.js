import { User } from "../models/User.js"
import { Otp } from "../models/Otp.js"

export const forgotPassword = async (request, response) => {

    const { email } = request.body

    try {
        if (!email) {
            response.status(400).send({ message: "Email is required" })
            return
        }

        const res = await User.findOne({ email })

        if (!res) {
            response.status(400).send({ message: "user not found" })
            return
        }

        const otp = generateOtp();

        const otpRecord = await bcrypt.hash(otp.toString(), 10)

        const mailData = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Password Reset OTP",
            text: `Here is Your 6 digit ${otp}`
        }

        const otpData = await Otp.create({
            id: res.id,
            otp: otpRecord,
            isUsed: false,
            email: email,
            expiresTime: new Date(Date.now() + 10 * 60 * 1000)
        })

        console.log(otp)

        await transporter.sendMail(mailData)

        response.status(200).json({ message: "Reset Password OTP Sent", res })

    } catch (error) {
        console.error("Error", error)
    }
}

export const changePassword = async (request, response) => {

    const { email, otp, newPassword } = request.body

    try {
        if (!email || !newPassword) {
            response.status(400).send({ message: "Email and Password is required" })
            return
        }

        const user = await User.findOne({ email })

        if (!user) {
            response.status(400).send({ message: "user not found" })
            return
        }

        if (user.otp != otp) {
            response.status(400).send({ message: "Invalid or expired otp" })
            return
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.otp = undefined
        await user.save()

        response.status(200).json({ message: "Password reset sucessfully", user })
    } catch (error) {
        console.error("error", error)
    }
}

export default { forgotPassword, changePassword }