'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: {
                    full_name: name,
                    role: 'USER',
                },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-center">
                <div className="w-full max-w-md space-y-6 rounded-2xl border bg-white p-8 shadow-lg">
                    <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Cek Email Kamu</h2>
                    <p className="text-gray-500">
                        Kami telah mengirimkan link konfirmasi ke <strong>{email}</strong>. Silakan verifikasi untuk melanjutkan.
                    </p>
                    <Link href="/login" className="block w-full h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold">
                        Kembali ke Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-8 shadow-lg">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <span className="text-2xl font-bold text-blue-600">LPKA Shop</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h2>
                    <p className="text-sm text-gray-500 mt-2">Mulai perjalananmu di LPKA Shop</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Nama Lengkap</label>
                            <input
                                type="text"
                                required
                                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Min. 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full h-12 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Daftar...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                        Masuk
                    </Link>
                </p>
            </div>
        </div>
    )
}
