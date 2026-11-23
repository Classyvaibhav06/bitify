/**
 * Minimal JSON-LD emitter. Escapes "<" so a text field can never close the
 * script element. Used by the homepage schema and every dedicated page.
 */
export function JsonLd({ schema }: { schema: object }) {
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
