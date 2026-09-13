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


// For 11111 Hardcoded

// import { Otp } from "../models/Otp.js"
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
// import { User } from "../models/User.js"
// import { generateOtp } from "../utils/helper.js"
// import transporter from "../services/emailService.js"

// /**
//  * Get all OTP records (Admin function)
//  */
// export const getOtp = async (request, response) => {
//     try {
//         const data = await Otp.find()
//         response.status(200).json({ 
//             message: "OTP data fetched", 
//             data,
//             success: true 
//         })
//     } catch (error) {
//         console.error("Error fetching otp data", error)
//         response.status(500).json({ 
//             message: "Internal server error",
//             success: false,
//             ...(process.env.NODE_ENV === "development" && { error: error.message })
//         })
//     }
// }

// /**
//  * Verify OTP with support for hardcoded 111111 for testing
//  */
// export const verifyOtp = async (request, response) => {
//     const { otp, email } = request.body

//     try {
//         if (!email || !otp) {
//             return response.status(400).json({ 
//                 message: "Email and OTP are required",
//                 success: false 
//             })
//         }

//         const otpString = otp.toString().trim()
//         const sanitizedEmail = email.toLowerCase().trim()

//         const HARDCODED_OTP = "111111"
//         const isHardcodedOtp = otpString === HARDCODED_OTP

//         let otpData = null

//         if (isHardcodedOtp) {
//             console.warn(`⚠️ DEVELOPMENT: Hardcoded OTP verified for email: ${sanitizedEmail}`)
            
//             // Try to fetch user data, but proceed even if not found
//             otpData = await Otp.findOne({ email: sanitizedEmail })

//             const otpToken = jwt.sign(
//                 { email: sanitizedEmail },
//                 process.env.JWT_SECRET_KEY,
//                 { expiresIn: "1d" }
//             )

//             response.cookie("otpToken", otpToken, {
//                 secure: process.env.NODE_ENV === "production",
//                 httpOnly: true,
//                 sameSite: "strict"
//             })

//             // Clean up OTP record if exists
//             if (otpData) {
//                 await Otp.deleteMany({ email: sanitizedEmail })
//             }

//             return response.status(200).json({ 
//                 message: "OTP Verified Successfully",
//                 data: otpData || { email: sanitizedEmail },
//                 success: true 
//             })
//         }

//         // Original logic - verify from database
//         otpData = await Otp.findOne({ email: sanitizedEmail })

//         if (!otpData) {
//             return response.status(400).json({ 
//                 message: "OTP not found. Please request a new OTP",
//                 success: false 
//             })
//         }

//         // Compare OTP with hashed value
//         const isMatch = await bcrypt.compare(otpString, otpData.otp)

//         if (!isMatch) {
//             return response.status(400).json({ 
//                 message: "Invalid OTP",
//                 success: false 
//             })
//         }

//         // Generate JWT token
//         const otpToken = jwt.sign(
//             { email: otpData.email },
//             process.env.JWT_SECRET_KEY,
//             { expiresIn: "1d" }
//         )

//         // Set secure cookie
//         response.cookie("otpToken", otpToken, {
//             secure: process.env.NODE_ENV === "production",
//             httpOnly: true,
//             sameSite: "strict"
//         })

//         // Delete OTP record after successful verification
//         await Otp.deleteMany({ email: sanitizedEmail })

//         return response.status(200).json({ 
//             message: "OTP Verified Successfully",
//             data: otpData,
//             success: true 
//         })

//     } catch (error) {
//         console.error("Error during OTP verification:", error)
//         return response.status(500).json({ 
//             message: "An error occurred during OTP verification",
//             success: false,
//             ...(process.env.NODE_ENV === "development" && { error: error.message })
//         })
//     }
// }

// /**
//  * Resend OTP to email
//  */
// export const resendOtp = async (request, response) => {
//     const { email } = request.body

//     try {
//         // Input validation
//         if (!email) {
//             return response.status(400).json({ 
//                 message: "Email is required",
//                 success: false 
//             })
//         }

//         // Sanitize email
//         const sanitizedEmail = email.toLowerCase().trim()

//         // Check if OTP record exists
//         const otpRecord = await Otp.findOne({ email: sanitizedEmail })

//         if (!otpRecord) {
//             return response.status(400).json({ 
//                 message: "User not found. Please sign up first",
//                 success: false 
//             })
//         }

//         // Generate new OTP
//         const newOtp = generateOtp()
//         const otpHash = await bcrypt.hash(newOtp, 10)

//         // Update OTP in database
//         const updatedData = await Otp.findOneAndUpdate(
//             { email: sanitizedEmail },
//             { otp: otpHash },
//             { new: true }
//         )

//         // Send OTP via email
//         const mailOptions = {
//             from: process.env.SENDER_EMAIL,
//             to: sanitizedEmail,
//             subject: "Resend OTP For Email Verification",
//             html: `
//                 <h2>Email Verification</h2>
//                 <p>Your OTP for email verification is:</p>
//                 <h1 style="color: #007bff; font-size: 36px; letter-spacing: 5px;">${newOtp}</h1>
//                 <p>This OTP is valid for 10 minutes.</p>
//                 <p>If you didn't request this, please ignore this email.</p>
//             `
//         }

//         await transporter.sendMail(mailOptions)

//         return response.status(200).json({ 
//             message: "New OTP has been sent to your email",
//             success: true,
//             data: {
//                 email: sanitizedEmail,
//                 message: "Check your email for the new OTP"
//             }
//         })

//     } catch (error) {
//         console.error("Error resending OTP:", error)
//         return response.status(500).json({ 
//             message: "An error occurred while resending OTP",
//             success: false,
//             ...(process.env.NODE_ENV === "development" && { error: error.message })
//         })
//     }
// }

// export default { getOtp, verifyOtp, resendOtp }