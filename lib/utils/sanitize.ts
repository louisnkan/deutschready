/**
 * Input sanitization utilities
 * Used on all user-facing inputs before any database operation
 */

// Strip HTML tags and dangerous characters
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')           // Remove HTML tags
    .replace(/[<>'"]/g, '')            // Remove dangerous chars
    .trim()
    .slice(0, 10000)                   // Hard length limit
}

// Sanitize and validate email
export function sanitizeEmail(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .slice(0, 254)                     // RFC 5321 max email length
}

// Validate answer is only a/b/c/d — nothing else accepted
export function validateAnswer(
  input: unknown
): 'a' | 'b' | 'c' | 'd' | null {
  if (typeof input !== 'string') return null
  const clean = input.toLowerCase().trim()
  if (['a', 'b', 'c', 'd'].includes(clean)) {
    return clean as 'a' | 'b' | 'c' | 'd'
  }
  return null
}

// Validate level is only a1/a2/b1/b2
export function validateLevel(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const clean = input.toLowerCase().trim()
  if (['a1', 'a2', 'b1', 'b2'].includes(clean)) return clean
  return null
}

// Validate skill is only allowed values
export function validateSkill(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const clean = input.toLowerCase().trim()
  const allowed = ['grammatik', 'lesen', 'hoeren', 'schreiben', 'sprechen']
  if (allowed.includes(clean)) return clean
  return null
}

// Sanitize full name for profile
export function sanitizeFullName(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-zA-Z\s\-'\.]/g, '') // Allow letters, spaces, hyphens, apostrophes, dots
    .trim()
    .slice(0, 100)
}

// Validate UUID format
export function validateUUID(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidRegex.test(input.trim())) return input.trim()
  return null
}
