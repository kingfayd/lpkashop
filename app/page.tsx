import { getProducts } from "@/lib/actions/product";
import { getCategories } from "@/lib/actions/category";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(q),
    getCategories(),
  ]);

  return (
    <div className="bg-white min-h-screen font-sans text-black">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 shrink-0">
            LPKA Shop
          </Link>

          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
              Daftar
            </Link>
          </div>
        </div>
        {/* Mobile Search Bar - Only visible on small screens */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar />
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-blue-600 py-16 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Premium Products, Simple Shopping
        </h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          Temukan produk impianmu dengan kualitas terbaik dan harga terjangkau.
          Belanja mudah, tinggal sekali klik!
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <h3 className="text-lg font-bold mb-4 text-gray-900 border-b pb-2">
              Kategori
            </h3>
            <div className="flex md:flex-col flex-wrap gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium text-left">
                Semua Produk
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium text-left transition-colors"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-400">
                  Belum ada produk yang tersedia.
                </div>
              ) : (
                products.map((product) => (
                  <Link
                    href={`/products/${product.id}`}
                    key={product.id}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                        {product.category.name}
                      </span>
                      <h4 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="mt-2 text-xl font-black text-gray-900">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                      <button className="mt-4 w-full bg-gray-950 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors">
                        <ShoppingCart size={18} />
                        Lihat Detail
                      </button>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2026 LPKA Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
