export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const teamId = query.id
  const config = useRuntimeConfig()

  if (!teamId) {
    return { error: 'Missing team ID' }
  }

  try {
    const data: any = await $fetch(`https://api.football-data.org/v4/teams/${teamId}`, {
      headers: {
        'X-Auth-Token': config.footballDataApiKey
      }
    })

    console.log(`[Football-Data] Team found: ${data.name}`)

    return {
      found: true,
      data: {
        id: data.id,
        name: data.name,
        shortName: data.shortName,
        tla: data.tla,
        badge: data.crest,
        address: data.address,
        website: data.website,
        founded: data.founded,
        colors: data.clubColors,
        venue: data.venue,
        runningCompetitions: data.runningCompetitions
      }
    }
  } catch (error) {
    console.error(`Error fetching Football-Data for team ${teamId}:`, error)
    return { found: false }
  }
})
