// server/api/top-scorers.ts
export default defineEventHandler(async () => {
  type Match = {
    homeTeam: {
      name: string
      picture: string
    }
    awayTeam: {
      name: string
      picture: string
    }
    homeTeamResult: { current: number }
    awayTeamResult: { current: number }
    liveStatus: string
  }

  type ApiResponse = {
    result: Match[]
  }

  const apiKey = process.env.API_KEY
  if (!apiKey) {
    throw new Error('API_KEY no está definido en el entorno')
  }

  try {
    const res = await $fetch<ApiResponse>(
      'https://api-latam.analyticom.de/api/live/FCF/competition/274811838/matches/paginated/past/0?page=1&pageSize=1000',
      {
        method: 'GET',
        headers: {
          'api_key': apiKey
        }
      }
    )

    const matches = res.result
    const teamStats = new Map<string, any>()

    // Procesar partidos para calcular estadísticas de goles
    for (const match of matches) {
      const home = match.homeTeam.name
      const away = match.awayTeam.name
      
      // Excluir el equipo "DESCANSA" y solo procesar partidos jugados
      if (home.toUpperCase() === "DESCANSA" || 
          away.toUpperCase() === "DESCANSA" || 
          match.liveStatus !== "PLAYED") continue

      const hg = match.homeTeamResult?.current ?? 0
      const ag = match.awayTeamResult?.current ?? 0

      const initTeam = (name: string, picture: string) => {
        if (!teamStats.has(name)) {
          teamStats.set(name, {
            name,
            picture,
            played: 0,
            gf: 0, // goles a favor
            ga: 0  // goles en contra
          })
        }
      }

      initTeam(home, match.homeTeam.picture)
      initTeam(away, match.awayTeam.picture)

      const homeTeam = teamStats.get(home)
      const awayTeam = teamStats.get(away)

      // Actualizar estadísticas
      homeTeam.played++
      awayTeam.played++
      homeTeam.gf += hg
      homeTeam.ga += ag
      awayTeam.gf += ag
      awayTeam.ga += hg
    }

    // Convertir a array y ordenar por goles a favor
    const topScorers = Array.from(teamStats.values())
      .sort((a, b) => {
        // Ordenar por goles a favor, luego por mejor promedio
        if (b.gf !== a.gf) return b.gf - a.gf
        
        const avgA = a.played > 0 ? a.gf / a.played : 0
        const avgB = b.played > 0 ? b.gf / b.played : 0
        
        return avgB - avgA
      })

    return topScorers

  } catch (error) {
    console.error('Error fetching top scorers:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener la tabla de goleadores'
    })
  }
})