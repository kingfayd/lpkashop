'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Cek jika sudah login, langsung lempar ke admin
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push('/admin')
            }
        }
        checkUser()
    }, [router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('Login error:', error)
            setError(error.message === 'Invalid login credentials'
                ? 'Email atau password salah, atau email belum dikonfirmasi.'
                : error.message)
            setLoading(false)
        } else {
            router.push('/admin')
            router.refresh()
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-8 shadow-lg">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <span className="text-2xl font-bold text-blue-600">LPKA Shop</span>
                    </Link>
                    <h2 className="text-2xl font-bold">Admin Login</h2>
                    <p className="text-sm text-gray-500 mt-2">Masuk ke Panel Admin LPKA Shop</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
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
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
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
