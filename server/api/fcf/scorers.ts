import { fcfFetch, getFcfImageUrl } from '~/server/utils/fcf'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const competitionId = query.id

  if (!competitionId) return []

  const url = `https://api-latam.analyticom.de/api/live/FCF/competition/${competitionId}/stats/goals?organizationIdFilter=329`
  const data: any = await fcfFetch(url)

  if (!Array.isArray(data)) return []

  return data.map((item: any) => ({
    player: {
      id: item.player.personId,
      name: item.player.name,
      shortName: item.player.shortName,
      image: getFcfImageUrl(item.player.picture)
    },
    goals: item.value,
    team: {
      id: item.team.id,
      name: item.team.name,
      image: getFcfImageUrl(item.team.picture)
    }
  }))
})
