'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            setError('Password tidak cocok')
            return
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter')
            return
        }

        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-8 shadow-lg text-center">
                    <div className="text-green-600 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Password Berhasil Diperbarui!</h2>
                    <p className="text-gray-500 mt-2">Sesi Anda telah diperbarui. Mengalihkan ke halaman login...</p>
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
                    <h2 className="text-2xl font-bold text-gray-900">Setel Ulang Password</h2>
                    <p className="text-sm text-gray-500 mt-2">Masukkan password baru untuk akun Anda</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                    {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Password Baru</label>
                            <input
                                type="password"
                                required
                                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Konfirmasi Password</label>
                            <input
                                type="password"
                                required
                                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full h-12 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Memperbarui...' : 'Simpan Password Baru'}
                    </button>
                </form>
            </div>
        </div>
    )
}
