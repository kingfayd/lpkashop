'use server'

import { createClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email dan password wajib diisi' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message === 'Invalid login credentials' 
            ? 'Email atau password salah.' 
            : error.message 
        }
    }

    redirect('/admin')
}
