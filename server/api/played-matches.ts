// server/api/played-matches.ts
export default defineEventHandler(async () => {
  type Match = {
    id: number
    homeTeam: {
      id: number
      name: string
      picture: string
      place: string
    }
    awayTeam: {
      id: number
      name: string
      picture: string
      place: string
    }
    homeTeamResult: {
      current: number
      regular: number
      half: number
    }
    awayTeamResult: {
      current: number
      regular: number
      half: number
    }
    liveStatus: string
    dateTimeUTC: number
    round: string
    roundOrder: number
    matchNumber: number
    currentMinute: string
    facility: {
      id: number
      name: string
      address: string
      place: string
    }
  }

  type ApiResponse = {
    result: Match[]
  }

  const apiKey = process.env.API_KEY
  if (!apiKey) {
    throw new Error('API_KEY no está definido en el entorno')
  }

  try {
    // Obtener partidos pasados (jugados)
    const res = await $fetch<ApiResponse>(
      'https://api-latam.analyticom.de/api/live/FCF/competition/274811838/matches/paginated/past/0?page=1&pageSize=1000',
      {
        method: 'GET',
        headers: {
          'api_key': apiKey
        }
      }
    )

    const playedMatches = res.result
      .filter(match => {
        // Filtrar solo partidos jugados y excluir el equipo "DESCANSA"
        return match.liveStatus === 'PLAYED' &&
               match.currentMinute === 'FT' &&
               match.homeTeam.name.toUpperCase() !== 'DESCANSA' &&
               match.awayTeam.name.toUpperCase() !== 'DESCANSA' &&
               match.homeTeamResult && 
               match.awayTeamResult
      })
      .sort((a, b) => b.dateTimeUTC - a.dateTimeUTC) // Ordenar de más reciente a más antigua

    return playedMatches

  } catch (error) {
    console.error('Error fetching played matches:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los partidos jugados'
    })
  }
})