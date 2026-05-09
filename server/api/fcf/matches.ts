import { fcfFetch, getFcfImageUrl } from '~/server/utils/fcf'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const groupId = query.groupId

  if (!groupId) return []

  const data: any = await fcfFetch(`https://api-latam.analyticom.de/api/live/FCF/competition/${groupId}/matches?organizationIdFilter=329`)

  if (!Array.isArray(data)) return []

  return data.map((m: any) => ({
    id: m.id,
    date: m.dateTimeUTC || m.date,
    round: m.round,
    status: m.liveStatus || m.status,
    homeTeam: { 
      id: m.homeTeam.id, 
      name: m.homeTeam.name, 
      image: getFcfImageUrl(m.homeTeam.picture) 
    },
    awayTeam: { 
      id: m.awayTeam.id, 
      name: m.awayTeam.name, 
      image: getFcfImageUrl(m.awayTeam.picture) 
    },
    homeScore: m.homeTeamScore,
    awayScore: m.awayTeamScore,
    facility: m.facility?.name
  }))
})
