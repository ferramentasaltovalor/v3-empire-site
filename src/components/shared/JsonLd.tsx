// src/components/shared/JsonLd.tsx
// JSON-LD structured data component for SEO
// Renders a script tag with structured data for search engines

interface JsonLdProps {
    /** The structured data object to render */
    data: object | object[]
}

/**
 * JSON-LD component for structured data
 * Renders a script tag with type="application/ld+json"
 * 
 * @example
 * ```tsx
 * <JsonLd data={organizationSchema()} />
 * <JsonLd data={[organizationSchema(), websiteSchema()]} />
 * ```
 */
export function JsonLd({ data }: JsonLdProps) {
    const json = Array.isArray(data) ? data : [data]

    return (
        <>
            {json.map((item, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
                />
            ))}
        </>
    )
}
