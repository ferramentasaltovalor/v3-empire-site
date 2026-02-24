// src/types/content.ts
// ============================================================================
// TIPOS PARA OS ARQUIVOS DE CONTEÚDO
// ============================================================================
// Este arquivo define os tipos TypeScript para todos os arquivos de conteúdo.
// Garante type-safety ao usar o conteúdo nos componentes.
// 
// NOTA: Usamos ReadonlyArray e readonly para compatibilidade com `as const`
// ============================================================================

// ============================================================================
// SITE CONTENT (src/content/site.ts)
// ============================================================================

export interface SiteContact {
    readonly email: string
    readonly phone: string
    readonly whatsapp: string
    readonly address: string
}

export interface SiteSocial {
    readonly instagram: string
    readonly youtube: string
    readonly linkedin: string
}

export interface SiteContent {
    readonly companyName: string
    readonly tagline: string
    readonly shortDescription: string
    readonly contact: SiteContact
    readonly social: SiteSocial
}

// ============================================================================
// NAVIGATION CONTENT (src/content/navigation.ts)
// ============================================================================

export interface NavLink {
    readonly label: string
    readonly href: string
}

export interface NavigationCta {
    readonly label: string
    readonly href: string
}

export interface NavigationContent {
    readonly mainLinks: readonly NavLink[]
    readonly cta: NavigationCta
    readonly mobileMenuOpen: string
    readonly mobileMenuClose: string
}

// ============================================================================
// HOME CONTENT (src/content/home.ts)
// ============================================================================

// Hero Section
export interface HeroCta {
    readonly primary: NavLink
    readonly secondary: NavLink
}

export interface HeroSection {
    readonly badge: string
    readonly title: string // Use [word] para destaque dourado
    readonly subtitle: string
    readonly benefits: readonly string[]
    readonly cta: HeroCta
}

// Social Proof Section
export interface StatItem {
    readonly number: string
    readonly label: string
}

export interface LogoItem {
    readonly name: string
    readonly src: string
    readonly alt: string
}

export interface SocialProofSection {
    readonly stats: readonly StatItem[]
    readonly logosTitle: string
    readonly logos: readonly LogoItem[]
}

// Problem Section
export interface PainPoint {
    readonly icon: string // Nome do ícone Lucide
    readonly title: string
    readonly description: string
    readonly quote: string
}

export interface ProblemSection {
    readonly label: string
    readonly title: string
    readonly subtitle: string
    readonly painPoints: readonly PainPoint[]
}

// Solution Section
export interface Feature {
    readonly title: string
    readonly description: string
}

export interface SolutionSection {
    readonly label: string
    readonly title: string
    readonly subtitle: string
    readonly features: readonly Feature[]
    readonly cta: NavLink
}

// Methodology Section
export interface MethodologyPhase {
    readonly number: string
    readonly badge: string
    readonly title: string
    readonly description: string
    readonly cards: readonly string[]
}

export interface MethodologySection {
    readonly label: string
    readonly title: string
    readonly phases: readonly MethodologyPhase[]
}

// Blog Preview Section
export interface BlogPreviewSection {
    readonly label: string
    readonly title: string
    readonly subtitle: string
    readonly cta: NavLink
}

// FAQ Section
export interface FaqItem {
    readonly question: string
    readonly answer: string
}

export interface FaqSection {
    readonly label: string
    readonly title: string
    readonly subtitle: string
    readonly items: readonly FaqItem[]
}

// Final CTA Section
export interface FinalCtaSection {
    readonly title: string
    readonly subtitle: string
    readonly cta: {
        readonly primary: NavLink
    }
}

// Complete Home Content
export interface HomeContent {
    readonly hero: HeroSection
    readonly socialProof: SocialProofSection
    readonly problem: ProblemSection
    readonly solution: SolutionSection
    readonly methodology: MethodologySection
    readonly blogPreview: BlogPreviewSection
    readonly faq: FaqSection
    readonly finalCta: FinalCtaSection
}

// ============================================================================
// SOBRE CONTENT (src/content/sobre.ts)
// ============================================================================

export interface HeroLabelSection {
    readonly label: string
    readonly title: string
    readonly subtitle: string
}

export interface MissionSection {
    readonly title: string
    readonly description: string
}

export interface VisionSection {
    readonly title: string
    readonly description: string
}

export interface Value {
    readonly title: string
    readonly description: string
}

export interface TeamMember {
    readonly name: string
    readonly role: string
    readonly bio: string
    readonly image: string
    readonly linkedin?: string
}

export interface TeamSection {
    readonly title: string
    readonly subtitle: string
    readonly members: readonly TeamMember[]
}

export interface TimelineEvent {
    readonly year: string
    readonly title: string
    readonly description: string
}

export interface TimelineSection {
    readonly title: string
    readonly events: readonly TimelineEvent[]
}

export interface SobreCta {
    readonly title: string
    readonly subtitle: string
    readonly button: NavLink
}

export interface SobreContent {
    readonly hero: HeroLabelSection
    readonly mission: MissionSection
    readonly vision: VisionSection
    readonly values: readonly Value[]
    readonly team: TeamSection
    readonly timeline: TimelineSection
    readonly cta: SobreCta
}

// ============================================================================
// CONTATO CONTENT (src/content/contato.ts)
// ============================================================================

export interface FormField {
    readonly label: string
    readonly placeholder: string
}

export interface FormFields {
    readonly name: FormField
    readonly email: FormField
    readonly company: FormField
    readonly phone: FormField
    readonly message: FormField
}

export interface FormConfig {
    readonly fields: FormFields
    readonly submitLabel: string
    readonly submittingLabel: string
    readonly successMessage: string
    readonly errorMessage: string
}

export interface ContactInfoCard {
    readonly icon: string // Nome do ícone Lucide
    readonly title: string
    readonly description: string
    readonly link: string | null
}

export interface ContactInfo {
    readonly title: string
    readonly cards: readonly ContactInfoCard[]
}

export interface BusinessHours {
    readonly title: string
    readonly description: string
}

export interface QuickFaq {
    readonly title: string
    readonly items: readonly FaqItem[]
}

export interface ContatoContent {
    readonly hero: HeroLabelSection
    readonly form: FormConfig
    readonly info: ContactInfo
    readonly businessHours: BusinessHours
    readonly quickFaq: QuickFaq
}

// ============================================================================
// FOOTER CONTENT (src/content/footer.ts)
// ============================================================================

export interface FooterBrand {
    readonly name: string
    readonly description: string
    readonly tagline: string
}

export interface FooterNavColumn {
    readonly title: string
    readonly links: readonly NavLink[]
}

export interface FooterNavigation {
    readonly main: FooterNavColumn
    readonly content: FooterNavColumn
}

export interface FooterLegal {
    readonly copyright: string
    readonly links: readonly NavLink[]
}

export interface SocialLink {
    readonly platform: string
    readonly label: string
    readonly href: string
    readonly icon: string
}

export interface FooterSocial {
    readonly title: string
    readonly links: readonly SocialLink[]
}

export interface FooterContact {
    readonly title: string
    readonly email: string
    readonly phone: string
    readonly whatsapp: string
}

export interface NewsletterConfig {
    readonly enabled: boolean
    readonly title: string
    readonly description: string
    readonly placeholder: string
    readonly buttonLabel: string
    readonly successMessage: string
    readonly errorMessage: string
}

export interface Badge {
    readonly name: string
    readonly image: string
    readonly href?: string
}

export interface FooterContent {
    readonly brand: FooterBrand
    readonly navigation: FooterNavigation
    readonly legal: FooterLegal
    readonly social: FooterSocial
    readonly contact: FooterContact
    readonly newsletter: NewsletterConfig
    readonly badges: readonly Badge[]
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Tipo para título com partes destacadas
export interface TitlePart {
    readonly text: string
    readonly isGold: boolean
}

// Tipo genérico para seções com label
export interface LabeledSection {
    readonly label?: string
    readonly title: string
    readonly subtitle?: string
}
