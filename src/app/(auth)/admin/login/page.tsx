'use client'

import { useState } from 'react'
import { login, resetPassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (isLogin) {
                const result = await login(formData)
                if (result?.error) {
                    setError(result.error)
                }
            } else {
                const result = await resetPassword(formData)
                if (result?.error) {
                    setError(result.error)
                } else if (result?.success) {
                    setSuccess(result.success)
                    setIsLogin(true)
                }
            }
        } catch (err) {
            setError('Ocorreu um erro inesperado')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-admin-text)]">
                    Empire Gold
                </h1>
                <p className="text-[var(--color-admin-muted)] mt-2">
                    {isLogin ? 'Acesse o painel administrativo' : 'Recupere sua senha'}
                </p>
            </div>

            <Card variant="admin" hover={false}>
                <CardHeader>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-4">
                            {success}
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[var(--color-admin-text)]">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                variant="light"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {isLogin && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-[var(--color-admin-text)]">Senha</Label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLogin(false)
                                            setError(null)
                                            setSuccess(null)
                                        }}
                                        className="text-sm text-[var(--color-admin-accent)] hover:underline"
                                    >
                                        Esqueceu a senha?
                                    </button>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    variant="light"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            loading={loading}
                        >
                            {isLogin ? 'Entrar' : 'Enviar link de recuperação'}
                        </Button>

                        {!isLogin && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(true)
                                    setError(null)
                                    setSuccess(null)
                                }}
                                className="w-full text-sm text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)] mt-4"
                            >
                                Voltar para o login
                            </button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
