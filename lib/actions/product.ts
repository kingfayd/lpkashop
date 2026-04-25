"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts(query?: string, categoryId?: string) {
    return await prisma.product.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
            ...(categoryId ? { categoryId } : {}),
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const shopeeUrl = formData.get("shopeeUrl") as string;

    if (!name || isNaN(price) || !categoryId) {
        return { error: "Missing required fields" };
    }

    try {
        await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                categoryId,
                imageUrl,
                shopeeUrl: shopeeUrl || null,
            },
        });
        revalidatePath("/admin/products");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Create Product Error:", error);
        return { error: "Failed to create product" };
    }
}

export async function updateProduct(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const shopeeUrl = formData.get("shopeeUrl") as string;

    if (!id || !name || isNaN(price) || !categoryId) {
        return { error: "Missing required fields" };
    }

    try {
        await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                stock,
                categoryId,
                ...(imageUrl ? { imageUrl } : {}),
                shopeeUrl: shopeeUrl || null,
            },
        });
        revalidatePath("/admin/products");
        revalidatePath("/");
        revalidatePath(`/products/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Update Product Error:", error);
        return { error: "Failed to update product" };
    }
}

export async function deleteProduct(formData: FormData) {
    const id = formData.get("id") as string;
    if (!id) return { error: "ID is required" };

    try {
        await prisma.product.delete({
            where: { id },
        });
        revalidatePath("/admin/products");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Delete Product Error:", error);
        return { error: "Failed to delete product" };
    }
}
