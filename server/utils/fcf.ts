export const fcfFetch = async (url: string) => {
  try {
    const response = await $fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Origin': 'https://fcf.com.co',
        'Referer': 'https://fcf.com.co/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      }
    })
    return response
  } catch (error: any) {
    console.error(`FCF API Error [${url}]:`, error.message)
    // Return empty array or object depending on likely expected type to prevent .map() crashes
    if (url.includes('standings') || url.includes('matches')) return []
    return null
  }
}

export const getFcfImageUrl = (pictureId: string) => {
  if (!pictureId) return '/images/default-team.png'
  return `https://api-latam.analyticom.de/api/live/FCF/images/${pictureId}?organizationIdFilter=329`
}
