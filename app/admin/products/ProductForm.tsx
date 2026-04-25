"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { createProduct, updateProduct } from "@/lib/actions/product";
import { Upload, X, Loader2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Product = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    imageUrl: string | null;
    shopeeUrl: string | null;
    categoryId: string;
};

export default function ProductForm({
    categories,
    editProduct,
    onCancel,
}: {
    categories: { id: string; name: string }[];
    editProduct?: Product;
    onCancel?: () => void;
}) {
    const isEditing = !!editProduct;
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(editProduct?.imageUrl || null);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        let imageUrl = editProduct?.imageUrl || "";

        if (image) {
            const fileExt = image.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error } = await supabase.storage
                .from("products")
                .upload(filePath, image);

            if (error) {
                alert(`Gagal upload gambar: ${error.message}`);
                setLoading(false);
                return;
            } else {
                const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(filePath);
                imageUrl = publicUrl;
            }
        }

        formData.set("imageUrl", imageUrl);

        let result;
        if (isEditing) {
            formData.set("id", editProduct.id);
            result = await updateProduct(formData);
        } else {
            result = await createProduct(formData);
        }

        if (result.success) {
            router.refresh();
            if (!isEditing) {
                setImage(null);
                setPreview(null);
                (e.target as HTMLFormElement).reset();
            } else {
                onCancel?.();
            }
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    return (
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                    {isEditing ? `Edit Produk: ${editProduct.name}` : "Tambah Produk Baru"}
                </h3>
                {isEditing && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nama Produk</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={editProduct?.name}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Kategori</label>
                        <select
                            name="categoryId"
                            defaultValue={editProduct?.categoryId}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black appearance-none"
                            required
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Harga (Rp)</label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            defaultValue={editProduct?.price}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Stok</label>
                        <input
                            type="number"
                            name="stock"
                            defaultValue={editProduct?.stock ?? 0}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                        name="description"
                        rows={3}
                        defaultValue={editProduct?.description || ""}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ShoppingBag size={16} className="text-[#EE4D2D]" />
                        Link Shopee (opsional)
                    </label>
                    <input
                        type="url"
                        name="shopeeUrl"
                        defaultValue={editProduct?.shopeeUrl || ""}
                        placeholder="https://shopee.co.id/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-black"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Gambar Produk {isEditing && "(biarkan kosong jika tidak ingin mengganti)"}
                    </label>
                    <div className="flex items-center gap-4">
                        <div
                            className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => document.getElementById("image-upload")?.click()}
                        >
                            {preview ? (
                                <>
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreview(isEditing ? (editProduct.imageUrl || null) : null);
                                            setImage(null);
                                        }}
                                        className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <Upload className="mx-auto mb-1" size={24} />
                                    <span className="text-xs">Upload</span>
                                </div>
                            )}
                        </div>
                        <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <div className="text-xs text-gray-500">
                            <p>Ukuran ideal: 800x800px</p>
                            <p>Maks. ukuran file: 2MB</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-bold disabled:bg-gray-400"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {isEditing ? "Menyimpan..." : "Menambahkan..."}
                            </>
                        ) : (
                            isEditing ? "Simpan Perubahan" : "Tambah Produk"
                        )}
                    </button>
                    {isEditing && onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}
