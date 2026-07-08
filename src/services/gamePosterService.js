const RAWG_GAMES_URL = 'https://api.rawg.io/api/games'
const CHEAPSHARK_GAMES_URL = 'https://www.cheapshark.com/api/1.0/games'
const STEAM_STORE_SEARCH_URL = 'https://store.steampowered.com/api/storesearch/'
const POSTER_TIMEOUT_MS = 2500
const LOCAL_STEAM_POSTERS = [
  {
    keywords: ['tekken 8', 'tekken'],
    steamAppId: '1778820',
  },
  {
    keywords: ['fifa', 'fc 25', 'fc25', 'ea sports fc'],
    steamAppId: '2669320',
  },
  {
    keywords: ['fc 24', 'ea sports fc 24'],
    steamAppId: '2195250',
  },
  {
    keywords: ['call of duty', 'warzone', 'modern warfare'],
    steamAppId: '1938090',
  },
  {
    keywords: ['marvel rivals'],
    steamAppId: '2767030',
  },
  {
    keywords: ['minecraft', 'minecraft legends'],
    steamAppId: '1928870',
  },
  {
    keywords: ['fortnite'],
    imageUrl: 'https://cdn2.unrealengine.com/fortnite-keyart-3840x2160-43a02bcecf4f.jpg',
  },
  {
    keywords: ['rocket league'],
    steamAppId: '252950',
  },
  {
    keywords: ['mortal kombat 1', 'mk1'],
    steamAppId: '1971870',
  },
  {
    keywords: ['mortal kombat 11', 'mk11'],
    steamAppId: '976310',
  },
  {
    keywords: ['elden ring'],
    steamAppId: '1245620',
  },
  {
    keywords: ['gta', 'grand theft auto'],
    steamAppId: '271590',
  },
  {
    keywords: ['cyberpunk'],
    steamAppId: '1091500',
  },
  {
    keywords: ['forza horizon 5', 'forza'],
    steamAppId: '1551360',
  },
  {
    keywords: ['counter strike', 'cs2', 'csgo'],
    steamAppId: '730',
  },
  {
    keywords: ['dota'],
    steamAppId: '570',
  },
  {
    keywords: ['pubg'],
    steamAppId: '578080',
  },
  {
    keywords: ['apex'],
    steamAppId: '1172470',
  },
  {
    keywords: ['god of war'],
    steamAppId: '1593500',
  },
  {
    keywords: ['red dead', 'rdr2'],
    steamAppId: '1174180',
  },
  {
    keywords: ['hogwarts'],
    steamAppId: '990080',
  },
  {
    keywords: ['spider man', 'spiderman'],
    steamAppId: '1817070',
  },
  {
    keywords: ['witcher'],
    steamAppId: '292030',
  },
  {
    keywords: ['hades'],
    steamAppId: '1145360',
  },
  {
    keywords: ['stardew'],
    steamAppId: '413150',
  },
  {
    keywords: ['among us'],
    steamAppId: '945360',
  },
  {
    keywords: ['fall guys'],
    steamAppId: '1097150',
  },
  {
    keywords: ['palworld'],
    steamAppId: '1623730',
  },
]

function getSteamPosterUrl(steamAppId) {
  if (!steamAppId) {
    return ''
  }

  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/header.jpg`
}

function findLocalPosterUrl(gameTitle) {
  const normalizedTitle = gameTitle.toLowerCase()
  const poster = LOCAL_STEAM_POSTERS.find((item) =>
    item.keywords.some((keyword) => normalizedTitle.includes(keyword)),
  )

  return poster?.imageUrl || getSteamPosterUrl(poster?.steamAppId)
}

async function fetchJson(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(POSTER_TIMEOUT_MS),
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

async function findSteamStorePosterUrl(title) {
  const url = new URL(STEAM_STORE_SEARCH_URL)
  url.searchParams.set('term', title)
  url.searchParams.set('l', 'en')
  url.searchParams.set('cc', 'us')

  const result = await fetchJson(url)
  const game = Array.isArray(result?.items) ? result.items[0] : null

  return game?.tiny_image || getSteamPosterUrl(game?.id) || ''
}

async function findRawgPosterUrl(title) {
  const apiKey = process.env.RAWG_API_KEY?.trim()

  if (!apiKey) {
    return ''
  }

  const url = new URL(RAWG_GAMES_URL)
  url.searchParams.set('key', apiKey)
  url.searchParams.set('search', title)
  url.searchParams.set('page_size', '1')

  const result = await fetchJson(url)
  const game = Array.isArray(result?.results) ? result.results[0] : null

  return game?.background_image || ''
}

export async function findGamePosterUrl(gameTitle) {
  const title = String(gameTitle ?? '').trim()

  if (!title) {
    return ''
  }

  try {
    const rawgPosterUrl = await findRawgPosterUrl(title)

    if (rawgPosterUrl) {
      return rawgPosterUrl
    }
  } catch (error) {
    console.warn('RAWG poster lookup failed, trying fallback sources.', error.message)
  }

  const localPosterUrl = findLocalPosterUrl(title)

  if (localPosterUrl) {
    return localPosterUrl
  }

  try {
    const url = new URL(CHEAPSHARK_GAMES_URL)
    url.searchParams.set('title', title)
    url.searchParams.set('limit', '1')

    const games = await fetchJson(url)
    const game = Array.isArray(games) ? games[0] : null

    const cheapSharkPoster = getSteamPosterUrl(game?.steamAppID) || game?.thumb || ''

    return cheapSharkPoster || (await findSteamStorePosterUrl(title))
  } catch (error) {
    try {
      return await findSteamStorePosterUrl(title)
    } catch (steamError) {
      console.warn('Game poster lookup failed, using fallback cover.', steamError.message || error.message)
      return ''
    }
  }
}
