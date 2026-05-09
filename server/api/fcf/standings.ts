import { fcfFetch, getFcfImageUrl } from '~/server/utils/fcf'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const groupId = query.groupId

  if (!groupId) return []

  const data: any = await fcfFetch(`https://api-latam.analyticom.de/api/live/FCF/competition/${groupId}/standings/official?organizationIdFilter=329`)

  if (!Array.isArray(data)) return []

  return data.map((r: any) => ({
    ...r,
    team: {
      ...r.team,
      image: getFcfImageUrl(r.team.picture)
    }
  }))
})
