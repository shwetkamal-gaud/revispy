import { connectDB } from '@/config/db'
import { User } from '@/models/User'
import { generateTokenAndSetCookie } from '@/utils/generateToken'
import bcrypt from 'bcryptjs'

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { email, password } = await req.json()
    await connectDB()

    const user = await User.findOne({ email })

    if (!user || !user.isVerified) {
        return NextResponse.json({ error: 'User not found or not verified' }, { status: 400 })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    generateTokenAndSetCookie(user._id?.toString() ?? '')
    return NextResponse.json({ success: true })
}
