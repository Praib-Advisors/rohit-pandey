/**
 * JSON for a <script type="application/ld+json"> tag. A "<" inside the data could close the tag early
 * ("</script>"), so every "<" is written as the JSON escape <, which parsers read back as "<".
 * The backslash is built from its character code so no editor or tool can quietly drop it.
 */
const BACKSLASH = String.fromCharCode(92);

export function jsonLdHtml(data: unknown) {
  return JSON.stringify(data).replace(/</g, `${BACKSLASH}u003c`);
}
