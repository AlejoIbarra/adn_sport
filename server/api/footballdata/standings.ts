export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const competitionCode = query.competitionCode || 'PL'
  const config = useRuntimeConfig()

  try {
    const data = await $fetch(`https://api.football-data.org/v4/competitions/${competitionCode}/standings`, {
      headers: {
        'X-Auth-Token': config.footballDataApiKey
      }
    })
    return data
  } catch (error) {
    console.error(`Error fetching Football-Data standings for ${competitionCode}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch standings'
    })
  }
})
