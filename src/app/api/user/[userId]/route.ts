import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
type tParams = Promise<{ userId: string }>;
export async function GET(req: NextRequest,
    context: { params: tParams }

) {
    const { userId } = await context.params
    if (!userId) return NextResponse.json({ message: "User ID is required" }, { status: 400 });

    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
}