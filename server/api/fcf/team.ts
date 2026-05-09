export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const teamId = query.id

  if (!teamId) {
    return { error: 'Missing team ID' }
  }

  try {
    const data: any = await $fetch(`https://api-latam.analyticom.de/api/live/FCF/team/${teamId}?organizationIdFilter=329`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://fcf.com.co',
        'Referer': 'https://fcf.com.co/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    })

    // Image URL helper
    const getImageUrl = (pictureId: string) => `https://api-latam.analyticom.de/api/live/FCF/images/${pictureId}?organizationIdFilter=329`

    return {
      found: true,
      data: {
        id: data.id,
        name: data.name,
        badge: getImageUrl(data.picture),
        founded: data.foundedYear || 'N/D',
        stadium: data.venueName || 'N/D',
        website: data.website || '',
        stadiumLocation: data.town || ''
      }
    }
  } catch (error) {
    console.error('Error fetching FCF team:', error)
    return { found: false }
  }
})
