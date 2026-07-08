import crypto from 'node:crypto'

const waitlistEntries = []

export function listWaitlistEntries(filters = {}) {
  const search = String(filters.search ?? '').trim().toLowerCase()
  const status = String(filters.status ?? '').trim().toLowerCase()

  return waitlistEntries.filter((entry) => {
    const matchesSearch =
      !search ||
      entry.playerName.toLowerCase().includes(search) ||
      entry.gameTitle.toLowerCase().includes(search)
    const matchesStatus = !status || entry.status === status

    return matchesSearch && matchesStatus
  })
}

export function findWaitlistEntry(id) {
  return waitlistEntries.find((entry) => entry.id === id) ?? null
}

export function addWaitlistEntry(payload) {
  const now = new Date().toISOString()
  const entry = {
    id: crypto.randomUUID(),
    ...payload,
    createdAt: now,
    updatedAt: now,
  }

  waitlistEntries.unshift(entry)
  return entry
}

export function reviseWaitlistEntry(id, payload) {
  const index = waitlistEntries.findIndex((entry) => entry.id === id)

  if (index === -1) {
    return null
  }

  const updatedEntry = {
    ...waitlistEntries[index],
    ...payload,
    id,
    updatedAt: new Date().toISOString(),
  }

  waitlistEntries[index] = updatedEntry
  return updatedEntry
}

export function removeWaitlistEntry(id) {
  const index = waitlistEntries.findIndex((entry) => entry.id === id)

  if (index === -1) {
    return null
  }

  const [deletedEntry] = waitlistEntries.splice(index, 1)
  return deletedEntry
}
