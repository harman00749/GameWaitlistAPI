const ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
}

export function sanitizeText(value, maxLength = 160) {
  return String(value ?? '')
    .trim()
    .slice(0, maxLength)
    .replace(/[&<>"'/]/g, (character) => ENTITY_MAP[character])
}

export function sanitizeUrl(value, maxLength = 400) {
  return String(value ?? '').trim().slice(0, maxLength)
}
