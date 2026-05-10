import { fcfFetch, getFcfImageUrl } from '~/server/utils/fcf'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const groupId = query.groupId

  if (!groupId) return []

  // Fetch both past and future matches to have the complete picture
  const [pastData, futureData]: any = await Promise.all([
    fcfFetch(`https://api-latam.analyticom.de/api/live/FCF/competition/${groupId}/matches/paginated/past/0?organizationIdFilter=329&page=1&pageSize=1000`),
    fcfFetch(`https://api-latam.analyticom.de/api/live/FCF/competition/${groupId}/matches/paginated/future/0?organizationIdFilter=329&page=1&pageSize=1000`)
  ])

  const allMatches = [
    ...(pastData?.result || []),
    ...(futureData?.result || [])
  ]

  if (!Array.isArray(allMatches)) return []

  // Sort and Map matches
  return allMatches.map((m: any) => ({
    id: m.id,
    date: m.dateTimeUTC || m.date,
    round: m.round,
    status: m.liveStatus || m.status,
    homeTeam: { 
      id: m.homeTeam.id, 
      name: m.homeTeam.name, 
      image: getFcfImageUrl(m.homeTeam.picture),
      place: m.homeTeam.place
    },
    awayTeam: { 
      id: m.awayTeam.id, 
      name: m.awayTeam.name, 
      image: getFcfImageUrl(m.awayTeam.picture),
      place: m.awayTeam.place
    },
    homeScore: m.homeTeamResult?.current ?? null,
    awayScore: m.awayTeamResult?.current ?? null,
    halfScore: m.homeTeamResult && m.awayTeamResult ? `${m.homeTeamResult.half} - ${m.awayTeamResult.half}` : null,
    facility: m.facility?.name,
    city: m.facility?.place || m.homeTeam.place
  }))
})
