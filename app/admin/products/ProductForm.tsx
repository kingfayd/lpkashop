"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { createProduct, updateProduct } from "@/lib/actions/product";
import { Upload, X, Loader2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ProductMedia = {
    id?: string;
    url: string;
    type: "IMAGE" | "VIDEO";
};

type Product = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    imageUrl: string | null;
    shopeeUrl: string | null;
    categoryId: string;
    media?: ProductMedia[];
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
    const [media, setMedia] = useState<ProductMedia[]>(editProduct?.media || []);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingMedia(true);
        const newMedia: ProductMedia[] = [...media];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const isVideo = file.type.startsWith("video/");
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error } = await supabase.storage
                .from("products")
                .upload(filePath, file);

            if (error) {
                alert(`Gagal upload media: ${error.message}`);
            } else {
                const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(filePath);
                newMedia.push({
                    url: publicUrl,
                    type: isVideo ? "VIDEO" : "IMAGE"
                });
            }
        }

        setMedia(newMedia);
        setUploadingMedia(false);
        e.target.value = ""; // Reset input
    };

    const removeMedia = (index: number) => {
        setMedia(media.filter((_, i) => i !== index));
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
                alert(`Gagal upload gambar utama: ${error.message}`);
                setLoading(false);
                return;
            } else {
                const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(filePath);
                imageUrl = publicUrl;
            }
        }

        formData.set("imageUrl", imageUrl);
        formData.set("media", JSON.stringify(media));

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
                setMedia([]);
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
            <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Gambar Utama (Thumbnail) */}
                <div className="space-y-2 border-t pt-4">
                    <label className="text-sm font-bold text-gray-900">
                        Gambar Utama (Thumbnail Katalog)
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
                            <p>Gambar yang muncul di halaman depan.</p>
                            <p>Maks. 2MB</p>
                        </div>
                    </div>
                </div>

                {/* Media Slider (Multi Photos & Videos) */}
                <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900">
                            Galeri Detail (Foto & Video)
                        </label>
                        <button
                            type="button"
                            onClick={() => document.getElementById("media-upload")?.click()}
                            disabled={uploadingMedia}
                            className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {uploadingMedia ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                            Tambah Media
                        </button>
                        <input
                            id="media-upload"
                            type="file"
                            multiple
                            className="hidden"
                            accept="image/*,video/*"
                            onChange={handleMediaUpload}
                        />
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {media.map((m, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                                {m.type === "IMAGE" ? (
                                    <Image src={m.url} alt="Media" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black">
                                        <video src={m.url} className="w-full h-full object-cover opacity-60" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeMedia(index)}
                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white text-center py-0.5">
                                    {m.type}
                                </div>
                            </div>
                        ))}
                        {media.length === 0 && !uploadingMedia && (
                            <div className="col-span-full py-8 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400 text-xs">
                                Belum ada foto/video tambahan.
                            </div>
                        )}
                        {uploadingMedia && (
                            <div className="aspect-square border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-blue-500 animate-pulse">
                                <Loader2 className="animate-spin mb-1" size={20} />
                                <span className="text-[10px]">Uploading...</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading || uploadingMedia}
                        className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-bold disabled:bg-gray-400 shadow-lg shadow-blue-100"
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
                            className="px-6 py-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}
