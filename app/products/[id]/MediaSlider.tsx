'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

type Media = {
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
}

export default function MediaSlider({ media, thumbnail }: { media: Media[], thumbnail: string | null }) {
    // Gabungkan thumbnail utama dengan media galeri
    const allMedia = [
        ...(thumbnail ? [{ id: 'thumb', url: thumbnail, type: 'IMAGE' as const }] : []),
        ...media
    ]

    const [currentIndex, setCurrentIndex] = useState(0)

    if (allMedia.length === 0) {
        return (
            <div className="aspect-square bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
                No Image Available
            </div>
        )
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1))
    }

    return (
        <div className="space-y-4">
            {/* Main Display */}
            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm group">
                {allMedia[currentIndex].type === 'IMAGE' ? (
                    <Image
                        src={allMedia[currentIndex].url}
                        alt="Product"
                        fill
                        className="object-cover transition-transform duration-500"
                    />
                ) : (
                    <video
                        src={allMedia[currentIndex].url}
                        controls
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                    />
                )}

                {/* Navigation Arrows */}
                {allMedia.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {allMedia.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {allMedia.map((m, index) => (
                        <button
                            key={m.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                                currentIndex === index ? 'border-blue-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                            {m.type === 'IMAGE' ? (
                                <Image src={m.url} alt="Thumb" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-black flex items-center justify-center">
                                    <video src={m.url} className="w-full h-full object-cover opacity-50" />
                                    <Play size={16} className="text-white absolute" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
