/**
 * Resolves a multilingual field based on the current language.
 * Handles both plain strings (backward compat) and {pt, en, es} objects.
 * Falls back to PT if the requested language is missing.
 */
export function resolveField(field, lang = "pt") {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.pt || "";
}
