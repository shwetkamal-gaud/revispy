import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
import { Category } from "../models/Category";
import { connectDB } from "../config/db";

async function seedCategories() {
    await connectDB();
    await Category.deleteMany({});
    const categories = Array.from({ length: 100 }, () => ({ name: faker.commerce.department() }));
    await Category.insertMany(categories);
    console.log("✅ Seeded 100 categories");
    process.exit();
}

seedCategories();
