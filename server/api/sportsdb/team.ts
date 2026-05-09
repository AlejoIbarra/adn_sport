export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const teamName = query.name as string

  console.log(`[API REQUEST] Fetching team info for: "${teamName}"`)

  if (!teamName || teamName === 'undefined') {
    return { error: 'Missing team name', found: false }
  }

  try {
    const searchUrl = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
    console.log(`[EXTERNAL API] Requesting: ${searchUrl}`)
    
    const data: any = await $fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    })

    if (!data.teams || data.teams.length === 0) {
      console.log(`[EXTERNAL API] No teams found for: ${teamName}`)
      return { found: false }
    }

    // Filter specifically for Soccer to avoid fuzzy matches from other sports
    const soccerTeams = data.teams.filter((t: any) => t.strSport === 'Soccer')
    
    if (soccerTeams.length === 0) {
      return { found: false }
    }

    // Try to find an exact name match first
    const team = soccerTeams.find((t: any) => {
      const dbName = t.strTeam.toLowerCase()
      const searchName = teamName.toLowerCase()
      // Coincidencia exacta o que uno contenga al otro (ej: "Real Madrid CF" vs "Real Madrid")
      return dbName === searchName || 
             dbName.includes(searchName) || 
             searchName.includes(dbName) ||
             t.strTeamShort?.toLowerCase() === searchName
    })

    if (!team) {
      console.log(`[EXTERNAL API] No exact match found for: ${teamName}.`)
      return { found: false }
    }

    console.log(`[EXTERNAL API] Match found: ${team.strTeam} (ID: ${team.idTeam})`)
    return {
      found: true,
      data: {
        id: team.idTeam,
        name: team.strTeam,
        founded: team.intFormedYear,
        stadium: team.strStadium,
        stadiumThumb: team.strStadiumThumb,
        stadiumLocation: team.strStadiumLocation,
        stadiumCapacity: team.intStadiumCapacity,
        badge: team.strTeamBadge,
        logo: team.strTeamLogo,
        banner: team.strTeamBanner,
        description: team.strDescriptionES || team.strDescriptionEN,
        website: team.strWebsite,
        facebook: team.strFacebook,
        twitter: team.strTwitter,
        instagram: team.strInstagram,
      }
    }
  } catch (error) {
    console.error(`Error fetching TheSportsDB data for team ${teamName}:`, error)
    return { found: false, error: 'API Error' }
  }
})
