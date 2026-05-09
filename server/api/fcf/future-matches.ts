import { fcfFetch, getFcfImageUrl } from '~/server/utils/fcf'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const competitionId = query.id || '341848806'

  const data: any = await fcfFetch(`https://api-latam.analyticom.de/api/live/FCF/competition/${competitionId}/matches/paginated/future/7?organizationIdFilter=329&page=1&pageSize=20`)

  if (!Array.isArray(data)) return []

  return data.map((m: any) => ({
    id: m.id,
    date: m.dateTimeUTC,
    round: m.round,
    groupName: m.competition?.name?.split(' /')[0] || 'Grupo',
    facility: m.facility?.name,
    homeTeam: { 
      id: m.homeTeam.id, 
      name: m.homeTeam.name, 
      image: getFcfImageUrl(m.homeTeam.picture) 
    },
    awayTeam: { 
      id: m.awayTeam.id, 
      name: m.awayTeam.name, 
      image: getFcfImageUrl(m.awayTeam.picture) 
    }
  }))
})
