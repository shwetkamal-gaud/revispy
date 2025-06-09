import { connectDB } from "@/config/db";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: { categoryId: string } }) {
    await connectDB();
    const categoryId = params.categoryId;
    const { userId } = await req.json(); 
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    const index = user.interests.indexOf(categoryId);

    if (index === -1) {
        user.interests.push(categoryId);
    } else {
        user.interests.splice(index, 1);
    }

    await user.save();
    return NextResponse.json({ message: "Interests updated", interests: user.interests });
}
