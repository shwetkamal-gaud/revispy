import { connectDB } from '@/config/db'
import {User} from '@/models/User'
import { NextResponse } from 'next/server'
import { deleteOtp, verifyOtp } from '@/utils/otpStore'
import { generateTokenAndSetCookie } from '@/utils/generateToken'

export async function POST(req: Request) {
    const { email, otp } = await req.json()
    await connectDB()

    const valid = await verifyOtp(email, otp);

    if (!valid) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }
    const user = await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
    )

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    deleteOtp(email)

    generateTokenAndSetCookie(user._id?.toString()??'')
    return NextResponse.json({ success: true })
}
