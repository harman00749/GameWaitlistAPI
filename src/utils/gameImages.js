const GAME_IMAGE_LIBRARY = [
  {
    keywords: ['tekken', 'street fighter', 'mortal kombat'],
    label: 'Fighting',
    pattern: 'diagonal',
  },
  {
    keywords: ['fifa', 'fc 24', 'fc 25', 'football', 'soccer'],
    label: 'Sports',
    pattern: 'field',
  },
  {
    keywords: ['mario kart', 'forza', 'need for speed', 'racing'],
    label: 'Racing',
    pattern: 'track',
  },
  {
    keywords: ['chess', 'catan', 'monopoly', 'board'],
    label: 'Strategy',
    pattern: 'grid',
  },
  {
    keywords: ['minecraft', 'roblox', 'sandbox'],
    label: 'Creative',
    pattern: 'blocks',
  },
  {
    keywords: ['call of duty', 'valorant', 'counter strike', 'fortnite'],
    label: 'Shooter',
    pattern: 'scope',
  },
]

function findGameImage(gameTitle) {
  const normalizedTitle = gameTitle.toLowerCase()

  return GAME_IMAGE_LIBRARY.find((image) =>
    image.keywords.some((keyword) => normalizedTitle.includes(keyword)),
  )
}

export function getGameImage(gameTitle) {
  const matchedImage = findGameImage(gameTitle)

  return {
    label: matchedImage?.label ?? 'Arcade',
    pattern: matchedImage?.pattern ?? 'default',
  }
}
