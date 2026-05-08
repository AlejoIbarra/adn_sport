export default defineEventHandler(async (event) => {
  try {
    const data = await $fetch('https://www.sofascore.com/api/v1/unique-tournament/19225/season/92699/team-events/total', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    })
    return data
  } catch (error) {
    console.error('Error fetching SofaScore team events:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch team events'
    })
  }
})
