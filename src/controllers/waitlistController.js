import {
  addWaitlistEntry,
  findWaitlistEntry,
  listWaitlistEntries,
  removeWaitlistEntry,
  reviseWaitlistEntry,
} from '../services/waitlistService.js'
import { findGamePosterUrl } from '../services/gamePosterService.js'
import { validateWaitlistPayload } from '../utils/validation.js'
import { sendJson } from '../utils/response.js'
import { logAnalytics } from '../utils/analytics.js'

export function getWaitlist(request, response) {
  const entries = listWaitlistEntries({
    search: request.query.search,
    status: request.query.status,
  })

  return sendJson(response, 200, {
    message: entries.length ? 'Waitlist entries retrieved.' : 'No data found.',
    data: entries,
    meta: {
      count: entries.length,
    },
  })
}

export function getEntryById(request, response) {
  const entry = findWaitlistEntry(request.params.id)

  if (!entry) {
    return sendJson(response, 404, {
      success: false,
      message: 'Waitlist entry not found.',
      data: null,
    })
  }

  return sendJson(response, 200, {
    message: 'Waitlist entry retrieved.',
    data: entry,
  })
}

async function hydratePoster(payload) {
  return {
    ...payload,
    imageUrl: await findGamePosterUrl(payload.gameTitle),
  }
}

export async function createEntry(request, response) {
  const validation = validateWaitlistPayload(request.body)

  if (!validation.isValid) {
    return sendJson(response, 400, {
      success: false,
      message: 'Validation failed.',
      errors: validation.errors,
      data: null,
    })
  }

  const hydratedPayload = await hydratePoster(validation.value)
  const entry = addWaitlistEntry(hydratedPayload)
  logAnalytics('created waitlist entry')

  return sendJson(response, 201, {
    message: 'Waitlist entry created.',
    data: entry,
  })
}

export async function updateEntry(request, response) {
  const existingEntry = findWaitlistEntry(request.params.id)

  if (!existingEntry) {
    return sendJson(response, 404, {
      success: false,
      message: 'Waitlist entry not found.',
      data: null,
    })
  }

  const validation = validateWaitlistPayload(request.body)

  if (!validation.isValid) {
    return sendJson(response, 400, {
      success: false,
      message: 'Validation failed.',
      errors: validation.errors,
      data: null,
    })
  }

  const hydratedPayload = await hydratePoster(validation.value)
  const entry = reviseWaitlistEntry(request.params.id, hydratedPayload)
  logAnalytics('updated waitlist entry')

  return sendJson(response, 200, {
    message: 'Waitlist entry updated.',
    data: entry,
  })
}

export function deleteEntry(request, response) {
  const deletedEntry = removeWaitlistEntry(request.params.id)

  if (!deletedEntry) {
    return sendJson(response, 404, {
      success: false,
      message: 'Waitlist entry not found.',
      data: null,
    })
  }

  logAnalytics('deleted waitlist entry')

  return sendJson(response, 200, {
    message: 'Waitlist entry deleted.',
    data: deletedEntry,
  })
}
