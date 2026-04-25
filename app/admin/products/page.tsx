import { getCategories } from "@/lib/actions/category";
import ProductsClient from "./ProductsClient";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
    const [products, categories] = await Promise.all([
        prisma.product.findMany({
            include: { 
                category: true,
                media: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { createdAt: "desc" },
        }),
        getCategories(),
    ]);

    return <ProductsClient products={products} categories={categories} />;
}
