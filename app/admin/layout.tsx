import Link from "next/link";
import { Package, LayoutDashboard, ListTree, LogOut } from "lucide-react";
import { createClient } from "@/app/lib/supabase-server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check role from database for security
    let dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
    });

    // Auto-sync user from Supabase to Prisma
    if (!dbUser) {
        const isFirstUser = await prisma.user.count() === 0;
        dbUser = await prisma.user.create({
            data: {
                email: user.email!,
                name: user.user_metadata?.full_name || user.email!.split("@")[0],
                role: isFirstUser ? 'ADMIN' : 'USER'
            }
        });
    }

    if (dbUser?.role !== 'ADMIN') {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-800">Shop Admin</h1>
                </div>
                <nav className="mt-6 px-4 space-y-2 flex-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Package size={20} />
                        <span>Products</span>
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ListTree size={20} />
                        <span>Categories</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 text-black">{children}</main>
        </div>
    );
}

function LogoutButton() {
    return (
        <form action="/auth/signout" method="post">
            <button
                type="submit"
                className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
                <LogOut size={20} />
                <span>Keluar</span>
            </button>
        </form>
    );
}
