import { fcfFetch } from '~/server/utils/fcf'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const competitionId = query.id || '341848806'
  return await fcfFetch(`https://api-latam.analyticom.de/api/live/FCF/competition/${competitionId}`)
})
