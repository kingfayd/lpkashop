"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { createProduct } from "@/lib/actions/product";
import { Upload, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductForm({
    categories,
}: {
    categories: { id: string; name: string }[];
}) {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
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
        let imageUrl = "";

        if (image) {
            const fileExt = image.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error } = await supabase.storage
                .from("products")
                .upload(filePath, image);

            if (error) {
                console.error("Upload error detail:", error);
                alert(`Failed to upload image: ${error.message}. Make sure bucket 'products' exists and RLS policies allow uploads.`);
            } else {
                const {
                    data: { publicUrl },
                } = supabase.storage.from("products").getPublicUrl(filePath);
                imageUrl = publicUrl;
            }
        }

        formData.append("imageUrl", imageUrl);
        const result = await createProduct(formData);

        if (result.success) {
            router.refresh();
            setImage(null);
            setPreview(null);
            (e.target as HTMLFormElement).reset();
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    return (
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Product</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="categoryId"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black appearance-none"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            defaultValue="0"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Product Image
                    </label>
                    <div className="flex items-center gap-4">
                        <div
                            className={`relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer`}
                            onClick={() => document.getElementById("image-upload")?.click()}
                        >
                            {preview ? (
                                <>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreview(null);
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
                            <p>Recommended size: 800x800px</p>
                            <p>Max file size: 2MB</p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-bold disabled:bg-gray-400"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Saving Product...
                        </>
                    ) : (
                        "Save Product"
                    )}
                </button>
            </form>
        </section>
    );
}
