import { connectDB } from "@/config/db";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { categoryId: string } }
) {
    try {
        await connectDB();

        const { categoryId } = params; 
        const { userId } = await req.json();

        if (!userId || !categoryId) {
            return NextResponse.json({ message: "User ID and Category ID are required" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        
        user.interests = user.interests || [];

        const index = user.interests.indexOf(categoryId);
        if (index === -1) {
            user.interests.push(categoryId);
        } else {
            user.interests.splice(index, 1);
        }

        await user.save();

        return NextResponse.json({
            message: "Interests updated successfully",
            interests: user.interests.map(String), 
        });

    } catch (error) {
        console.error("PATCH /user/interests/[categoryId] error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error instanceof Error ? error.message : error }, { status: 500 });
    }
}

