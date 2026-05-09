export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tournamentId = query.tournamentId || '26947'
  const seasonId = query.seasonId || '92699'

  try {
    const data = await $fetch(`https://www.sofascore.com/api/v1/unique-tournament/${tournamentId}/season/${seasonId}/rounds`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    })
    return data
  } catch (error) {
    console.error(`Error fetching SofaScore rounds for tournament ${tournamentId}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch rounds info'
    })
  }
})
