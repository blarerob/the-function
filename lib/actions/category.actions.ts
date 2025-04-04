"use server"

import { CreateCategoryParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"

export const createCategory = async ({ categoryName }: CreateCategoryParams) => {
    try {
        await connectToDatabase();

        const newCategory = await Category.create({ name: categoryName });
        console.log('New Category Created:', newCategory);

        return JSON.parse(JSON.stringify(newCategory));
    } catch (error) {
        console.error('Error creating category:', error);
        handleError(error);
        throw error; // Re-throw the error to be caught in the calling function
    }
}

export const getAllCategories = async () => {
    try {
        await connectToDatabase();

        const categories = await Category.find();
        console.log('Fetched Categories:', categories);

        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        console.error('Error fetching categories:', error);
        handleError(error);
        throw error; // Re-throw the error to be caught in the calling function
    }
}