import { Schema, model, Document, models } from 'mongoose';

interface ICategory extends Document {
    name: string,
}
const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    
}, );

export const Category = models.Category || model<ICategory>("Category", categorySchema);
