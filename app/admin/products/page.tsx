import { getProducts } from "@/lib/actions/product";
import { getCategories } from "@/lib/actions/category";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    return <ProductsClient products={products} categories={categories} />;
}
