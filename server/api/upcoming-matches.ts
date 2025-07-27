// server/api/upcoming-matches.ts
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
    liveStatus: string
    dateTimeUTC: number
    round: string
    matchNumber: number
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
    // Obtener partidos futuros
    const res = await $fetch<ApiResponse>(
      'https://api-latam.analyticom.de/api/live/FCF/competition/274811838/matches/paginated/future/0?page=1&pageSize=1000',
      {
        method: 'GET',
        headers: {
          'api_key': apiKey
        }
      }
    )

    const upcomingMatches = res.result
      .filter(match => {
        // Filtrar partidos programados y excluir el equipo "DESCANSA"
        return match.liveStatus === 'SCHEDULED' &&
               match.homeTeam.name.toUpperCase() !== 'DESCANSA' &&
               match.awayTeam.name.toUpperCase() !== 'DESCANSA'
      })
      .sort((a, b) => a.dateTimeUTC - b.dateTimeUTC) // Ordenar por fecha
      .slice(0, 10) // Limitar a los próximos 10 partidos

    return upcomingMatches

  } catch (error) {
    console.error('Error fetching upcoming matches:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los próximos partidos'
    })
  }
})