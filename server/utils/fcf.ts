export const fcfFetch = async (url: string) => {
  const finalUrl = url.replace('scores.analyticom.de', 'api-latam.analyticom.de')
  
  console.log(`[FCF FETCH] Requesting with API KEY: ${finalUrl}`)

  try {
    const response = await $fetch(finalUrl, {
      headers: {
        'authority': 'api-latam.analyticom.de',
        'accept': '*/*',
        'accept-language': 'es-419,es;q=0.9',
        'api_key': 'f54b8e1964a06d3e6f6795efc803676a50752527215eb33de59923bee8120f7f659fc7b23313c08dc5d1cf46a5cf4b2725a31632d8b59cfe3a598fcea77b1c06',
        'origin': 'https://apps.difutbol.org',
        'referer': 'https://apps.difutbol.org/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site'
      },
      retry: 3,
      retryDelay: 1000,
      timeout: 20000
    })
    return response
  } catch (error: any) {
    console.error(`[FCF FETCH ERROR] [${finalUrl}]:`, error.message)
    if (finalUrl.includes('standings') || finalUrl.includes('matches')) return []
    return null
  }
}

export const getFcfImageUrl = (pictureId: string) => {
  if (!pictureId) return '/images/default-team.png'
  return `https://api-latam.analyticom.de/api/live/FCF/images/${pictureId}?organizationIdFilter=329`
}
