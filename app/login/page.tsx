'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from './actions'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        
        const result = await login(formData)
        
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-8 shadow-lg">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <span className="text-2xl font-bold text-blue-600">LPKA Shop</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                    <p className="text-sm text-gray-500 mt-2">Masuk ke Panel Admin LPKA Shop</p>
                </div>

                <form className="mt-8 space-y-6" action={handleSubmit}>
                    {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
                                placeholder="nama@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Masuk...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </div>
    )
}
