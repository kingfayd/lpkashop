"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { name: "asc" },
    });
}

export async function createCategory(formData: FormData) {
    const name = formData.get("name") as string;
    if (!name) return { error: "Name is required" };

    try {
        await prisma.category.create({
            data: { name },
        });
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error) {
        console.error("Create Category Error:", error);
        return { error: "Failed to create category" };
    }
}

export async function deleteCategory(formData: FormData) {
    const id = formData.get("id") as string;
    if (!id) return { error: "ID is required" };

    try {
        await prisma.category.delete({
            where: { id },
        });
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error) {
        console.error("Delete Category Error:", error);
        return { error: "Failed to delete category" };
    }
}
