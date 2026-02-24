'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email e senha são obrigatórios' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    redirect('/admin')
}

export async function resetPassword(formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email é obrigatório' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: 'Email de recuperação enviado com sucesso' }
}
