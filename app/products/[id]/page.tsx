import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, MessageCircle, Package, ShieldCheck, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";
import MediaSlider from "./MediaSlider";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: { 
            category: true,
            media: {
                orderBy: { order: 'asc' }
            }
        },
    });

    if (!product) {
        notFound();
    }

    const whatsappNumber = "6281234567890"; // Placeholder
    const message = `Halo, saya ingin membeli ${product.name} seharga Rp ${product.price.toLocaleString("id-ID")}. Apakah stok masih ada?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
    )}`;

    return (
        <div className="bg-white min-h-screen font-sans text-black">
            {/* Navbar Minimalist */}
            <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                    >
                        <ChevronLeft size={20} />
                        Kembali ke Katalog
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Image Gallery Slider */}
                    <div className="flex-1">
                        <MediaSlider media={product.media} thumbnail={product.imageUrl} />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {product.category.name}
                            </span>
                            <h1 className="mt-4 text-4xl font-extrabold text-gray-900 leading-tight">
                                {product.name}
                            </h1>
                            <p className="mt-4 text-3xl font-black text-gray-900">
                                Rp {product.price.toLocaleString("id-ID")}
                            </p>
                        </div>

                        <div className="text-gray-600 max-w-none">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                                Deskripsi Produk
                            </h3>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {product.description || "Tidak ada deskripsi untuk produk ini."}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Package size={18} className="text-blue-600" />
                                <span>
                                    Stok Tersedia: <strong>{product.stock} pcs</strong>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <ShieldCheck size={18} className="text-green-600" />
                                <span>Kualitas Terjamin & Transaksi Aman</span>
                            </div>
                        </div>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-[#20ba5a] transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-200"
                        >
                            <MessageCircle size={24} />
                            Beli Sekarang via WhatsApp
                        </a>

                        {product.shopeeUrl && (
                            <a
                                href={product.shopeeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#EE4D2D] text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-[#d74223] transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-200"
                            >
                                <ShoppingBag size={24} />
                                Beli via Shopee
                            </a>
                        )}
                    </div>
                </div>
            </main>

            <footer className="mt-20 py-12 border-t border-gray-100 text-center text-gray-400 text-xs">
                <p>© 2026 LPKA Shop. All rights reserved.</p>
            </footer>
        </div>
    );
}
