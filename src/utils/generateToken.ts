import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export const generateTokenAndSetCookie = async (userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '10d' })
    const isProd = process.env.NODE_ENV === 'production'
    const cookieStore = await cookies()
    cookieStore.set('jwt', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 10 * 24 * 60 * 60,
        path: '/',
    })
}
