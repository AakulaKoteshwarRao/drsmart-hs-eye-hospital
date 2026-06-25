// components/SchemaMarkup.tsx
//
// Merges core + page graph arrays into ONE @graph block per page.
// XSS protection: escapes </script> in JSON output.
// Null safety: filters undefined/null graph arrays.

interface SchemaMarkupProps {
  graphs: object[][]
}

export default function SchemaMarkup({ graphs }: SchemaMarkupProps) {
  const merged = {
    "@context": "https://schema.org",
    "@graph":   graphs.filter(Boolean).flat(),
  }

  // Escape </script> to prevent HTML injection
  const safeJson = JSON.stringify(merged).replace(/</g, "\\u003c")

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  )
}
