import { sanitizeText } from './sanitize.js'
import { getGameImage } from './gameImages.js'

const VALID_STATUSES = ['waiting', 'seated', 'cancelled']
const PHONE_PATTERN = /^[+()\-\s0-9]{7,20}$/

function requireText(value, fieldName, errors, maxLength = 80) {
  const sanitizedValue = sanitizeText(value)

  if (!sanitizedValue) {
    errors[fieldName] = 'This field is required.'
    return ''
  }

  if (sanitizedValue.length > maxLength) {
    errors[fieldName] = `Must be ${maxLength} characters or fewer.`
  }

  return sanitizedValue
}

export function validateWaitlistPayload(payload = {}) {
  const errors = {}
  const playerName = requireText(payload.playerName, 'playerName', errors)
  const gameTitle = requireText(payload.gameTitle, 'gameTitle', errors)
  const phone = sanitizeText(payload.phone)
  const notes = sanitizeText(payload.notes, 160)
  const partySize = Number(payload.partySize)
  const status = sanitizeText(payload.status || 'waiting').toLowerCase()

  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 12) {
    errors.partySize = 'Party size must be a whole number from 1 to 12.'
  }

  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = 'Phone must contain 7 to 20 valid phone characters.'
  }

  if (!VALID_STATUSES.includes(status)) {
    errors.status = 'Status must be waiting, seated, or cancelled.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: {
      playerName,
      gameTitle,
      gameImage: getGameImage(gameTitle),
      imageUrl: '',
      partySize,
      phone,
      status,
      notes,
    },
  }
}
