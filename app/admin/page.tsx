import { prisma } from "@/lib/prisma";
import { Package, ListTree } from "lucide-react";

export default async function AdminDashboard() {
    const [productCount, categoryCount] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
    ]);

    const stats = [
        {
            label: "Total Products",
            value: productCount,
            icon: Package,
            color: "bg-blue-100 text-blue-600",
        },
        {
            label: "Categories",
            value: categoryCount,
            icon: ListTree,
            color: "bg-green-100 text-green-600",
        },
    ];

    return (
        <div>
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-500">Welcome to your shop management panel.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"
                    >
                        <div className={`p-4 rounded-lg ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <section className="mt-12 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <a
                        href="/admin/products"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Manage Products
                    </a>
                    <a
                        href="/admin/categories"
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
                    >
                        Manage Categories
                    </a>
                </div>
            </section>
        </div>
    );
}
