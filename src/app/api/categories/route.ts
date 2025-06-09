import { connectDB } from "@/config/db";
import { Category } from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 6;
    const skip = (page - 1) * limit;

    try {
        const categories = await Category.find().skip(skip).limit(limit);
        const total = await Category.countDocuments();

        return NextResponse.json({
            categories,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch categories", error },
            { status: 500 }
        );
    }
}
