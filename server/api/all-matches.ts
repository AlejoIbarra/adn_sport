// server/api/all-matches.ts
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
    homeTeamResult?: {
      current: number
      regular: number
      half: number
    }
    awayTeamResult?: {
      current: number
      regular: number
      half: number
    }
    liveStatus: string
    dateTimeUTC: number
    round: string
    roundOrder: number
    matchNumber: number
    currentMinute?: string
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
    // Obtener partidos pasados (jugados) y futuros (programados) en paralelo
    const [pastMatches, futureMatches] = await Promise.all([
      $fetch<ApiResponse>(
        'https://api-latam.analyticom.de/api/live/FCF/competition/274811838/matches/paginated/past/0?page=1&pageSize=1000',
        {
          method: 'GET',
          headers: {
            'api_key': apiKey
          }
        }
      ),
      $fetch<ApiResponse>(
        'https://api-latam.analyticom.de/api/live/FCF/competition/274811838/matches/paginated/future/0?page=1&pageSize=1000',
        {
          method: 'GET',
          headers: {
            'api_key': apiKey
          }
        }
      )
    ])

    // Combinar y filtrar todos los partidos
    const allMatches = [...pastMatches.result, ...futureMatches.result]
      .filter(match => {
        // Excluir el equipo "DESCANSA" y filtrar por estados válidos
        const isValidMatch = match.homeTeam.name.toUpperCase() !== 'DESCANSA' &&
                             match.awayTeam.name.toUpperCase() !== 'DESCANSA'
        
        // Incluir partidos jugados y programados
        const isValidStatus = match.liveStatus === 'PLAYED' || 
                             match.liveStatus === 'SCHEDULED'
        
        return isValidMatch && isValidStatus
      })
      .sort((a, b) => a.dateTimeUTC - b.dateTimeUTC) // Ordenar cronológicamente

    return allMatches

  } catch (error) {
    console.error('Error fetching all matches:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los partidos'
    })
  }
})