import { connectDB } from '@/config/db'
import { User } from '@/models/User'
import { generateOtp } from '@/utils/generateOtp'
import { sendOtpEmail } from '@/utils/mailer'
import { setOtp } from '@/utils/otpStore'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { name, email, password } = await req.json()
    await connectDB()

    const userExists = await User.findOne({ email })

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOtp()

    if (userExists && userExists.isVerified) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    await User.findOneAndUpdate(
        { email },
        { name, email, password: hashedPassword, isVerified: false },
        { upsert: true, new: true }
    )
    setOtp(email, otp);
    await sendOtpEmail(email, otp)

    return NextResponse.json({ message: 'OTP sent to email' })
}
