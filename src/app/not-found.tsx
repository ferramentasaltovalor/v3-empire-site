import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--color-empire-bg)] flex items-center justify-center p-8">
            <div className="text-center space-y-6 max-w-md">
                {/* 404 number */}
                <div className="relative">
                    <span className="text-[150px] sm:text-[200px] font-display font-bold text-[var(--color-empire-card)] select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gold-gradient text-6xl sm:text-7xl font-display font-bold">
                            404
                        </span>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-display font-semibold text-[var(--color-empire-text)]">
                        Página não encontrada
                    </h1>
                    <p className="text-[var(--color-empire-muted)]">
                        A página que você está procurando não existe ou foi movida.
                    </p>
                </div>

                {/* CTA */}
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[var(--color-empire-gold)] via-[var(--color-empire-gold-light)] to-[var(--color-empire-gold)] text-[var(--color-empire-bg)] font-semibold rounded-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-gold)] transition-all duration-300"
                >
                    Voltar para o início
                </Link>
            </div>
        </div>
    )
}
