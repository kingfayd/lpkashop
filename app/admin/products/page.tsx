import { getProducts, deleteProduct } from "@/lib/actions/product";
import { getCategories } from "@/lib/actions/category";
import ProductForm from "./ProductForm";
import { Trash2, Package } from "lucide-react";
import Image from "next/image";

export default async function ProductsPage() {
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    return (
        <div className="max-w-6xl">
            <header className="mb-8 text-black">
                <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
                <p className="text-gray-500">
                    Add, edit, or remove products from your catalog.
                </p>
            </header>

            <ProductForm categories={categories} />

            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8 text-black">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                Image
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                Name
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                Category
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                Price
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                Stock
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-8 text-center text-gray-500 italic"
                                >
                                    No products found. Add one above.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="rounded-lg object-cover bg-gray-100"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                <Package size={20} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {product.name}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                                            {product.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                            {product.category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-bold">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800">{product.stock}</td>
                                    <td className="px-6 py-4 text-right">
                                        <form action={deleteProduct as unknown as (payload: FormData) => void}>
                                            <input type="hidden" name="id" value={product.id} />
                                            <button
                                                type="submit"
                                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
