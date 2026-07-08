const form = document.querySelector('#waitlist-form')
const entryIdInput = document.querySelector('#entry-id')
const submitButton = document.querySelector('#submit-button')
const resetButton = document.querySelector('#reset-button')
const refreshButton = document.querySelector('#refresh-button')
const searchInput = document.querySelector('#search')
const entriesContainer = document.querySelector('#entries')
const loadingIndicator = document.querySelector('#loading')
const emptyState = document.querySelector('#empty-state')
const messageBox = document.querySelector('#message')
const resultCount = document.querySelector('#result-count')

let currentEntries = []

function setLoading(isLoading) {
  loadingIndicator.hidden = !isLoading
}

function setMessage(message) {
  messageBox.textContent = message
}

function sanitizeClientText(value) {
  const wrapper = document.createElement('div')
  wrapper.textContent = String(value ?? '').trim()
  return wrapper.textContent
}

function clearErrors() {
  form.querySelectorAll('.field-error').forEach((element) => {
    element.textContent = ''
  })
  form.querySelectorAll('.is-invalid').forEach((element) => {
    element.classList.remove('is-invalid')
    element.removeAttribute('aria-invalid')
  })
}

function applyErrors(errors = {}) {
  Object.entries(errors).forEach(([field, error]) => {
    const input = form.elements[field]
    const errorElement = document.querySelector(`#${field}-error`)

    if (input) {
      input.classList.add('is-invalid')
      input.setAttribute('aria-invalid', 'true')
    }

    if (errorElement) {
      errorElement.textContent = error
    }
  })
}

function getPayload() {
  const formData = new FormData(form)

  return {
    playerName: sanitizeClientText(formData.get('playerName')),
    gameTitle: sanitizeClientText(formData.get('gameTitle')),
    partySize: Number(formData.get('partySize')),
    phone: sanitizeClientText(formData.get('phone')),
    status: sanitizeClientText(formData.get('status')),
    notes: sanitizeClientText(formData.get('notes')),
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  const body = await response.json()

  if (!response.ok) {
    const error = new Error(body.message || 'Request failed.')
    error.body = body
    throw error
  }

  return body
}

function renderEntries(entries) {
  entriesContainer.textContent = ''
  emptyState.hidden = entries.length !== 0
  resultCount.textContent = `${entries.length} waitlist entr${entries.length === 1 ? 'y' : 'ies'}`

  entries.forEach((entry) => {
    const card = document.createElement('article')
    card.className = 'entry-card'

    const image = createGameVisual(entry)

    const title = document.createElement('h3')
    title.textContent = `${entry.playerName} - ${entry.gameTitle}`

    const meta = document.createElement('div')
    meta.className = 'entry-meta'
    meta.innerHTML = `
      <span>Party: ${entry.partySize}</span>
      <span>Status: ${entry.status}</span>
      <span>Phone: ${entry.phone || 'N/A'}</span>
    `

    const notes = document.createElement('p')
    notes.textContent = entry.notes || 'No notes added.'

    const actions = document.createElement('div')
    actions.className = 'entry-actions'

    const editButton = document.createElement('button')
    editButton.type = 'button'
    editButton.textContent = 'Edit'
    editButton.setAttribute('aria-label', `Edit ${entry.playerName}`)
    editButton.addEventListener('click', () => startEdit(entry))

    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.className = 'secondary-button'
    deleteButton.textContent = 'Delete'
    deleteButton.setAttribute('aria-label', `Delete ${entry.playerName}`)
    deleteButton.addEventListener('click', () => deleteEntry(entry.id))

    actions.append(editButton, deleteButton)
    card.append(image, title, meta, notes, actions)
    entriesContainer.append(card)
  })
}

function createFallbackCover(entry) {
  const cover = document.createElement('div')
  cover.className = `game-cover game-cover-${entry.gameImage?.pattern || 'default'}`
  cover.setAttribute('role', 'img')
  cover.setAttribute('aria-label', `${entry.gameTitle} cover image`)

  const imageLabel = document.createElement('span')
  imageLabel.textContent = entry.gameImage?.label || 'Arcade'
  cover.append(imageLabel)

  return cover
}

function createGameVisual(entry) {
  if (!entry.imageUrl) {
    return createFallbackCover(entry)
  }

  const image = document.createElement('img')
  image.className = 'game-poster'
  image.src = entry.imageUrl
  image.alt = `${entry.gameTitle} poster`
  image.loading = 'lazy'
  image.addEventListener('error', () => {
    image.replaceWith(createFallbackCover(entry))
  })

  return image
}

async function loadEntries() {
  try {
    setLoading(true)
    setMessage('')
    const params = new URLSearchParams()
    const search = searchInput.value.trim()

    if (search) {
      params.set('search', search)
    }

    const response = await requestJson(`/api/waitlist?${params.toString()}`)
    currentEntries = response.data
    renderEntries(currentEntries)
  } catch (error) {
    setMessage(error.message)
  } finally {
    setLoading(false)
  }
}

function startEdit(entry) {
  entryIdInput.value = entry.id
  form.elements.playerName.value = entry.playerName
  form.elements.gameTitle.value = entry.gameTitle
  form.elements.partySize.value = entry.partySize
  form.elements.phone.value = entry.phone
  form.elements.status.value = entry.status
  form.elements.notes.value = entry.notes
  submitButton.textContent = 'Update entry'
  setMessage(`Editing ${entry.playerName}.`)
  form.elements.playerName.focus()
}

function resetForm() {
  form.reset()
  entryIdInput.value = ''
  submitButton.textContent = 'Add entry'
  clearErrors()
  setMessage('')
}

async function saveEntry(event) {
  event.preventDefault()
  clearErrors()

  const payload = getPayload()
  const entryId = entryIdInput.value
  const url = entryId ? `/api/waitlist/${entryId}` : '/api/waitlist'
  const method = entryId ? 'PUT' : 'POST'

  try {
    setLoading(true)
    const response = await requestJson(url, {
      method,
      body: JSON.stringify(payload),
    })

    console.log('[Analytics] User interacted with Game Waitlist CRUD API with Route Parameters')
    setMessage(response.message)
    resetForm()
    await loadEntries()
  } catch (error) {
    if (error.body?.errors) {
      applyErrors(error.body.errors)
    }
    setMessage(error.message)
  } finally {
    setLoading(false)
  }
}

async function deleteEntry(id) {
  try {
    setLoading(true)
    const response = await requestJson(`/api/waitlist/${id}`, {
      method: 'DELETE',
    })

    console.log('[Analytics] User interacted with Game Waitlist CRUD API with Route Parameters')
    setMessage(response.message)
    await loadEntries()
  } catch (error) {
    setMessage(error.message)
  } finally {
    setLoading(false)
  }
}

form.addEventListener('submit', saveEntry)
resetButton.addEventListener('click', resetForm)
refreshButton.addEventListener('click', loadEntries)
searchInput.addEventListener('input', () => {
  window.clearTimeout(searchInput.searchTimer)
  searchInput.searchTimer = window.setTimeout(loadEntries, 300)
})

loadEntries()
