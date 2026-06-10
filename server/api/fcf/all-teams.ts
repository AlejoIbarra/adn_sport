import { fcfFetch } from '~/server/utils/fcf'

interface TeamMapping {
  id: number
  name: string
  groupId: number
  groupName: string
}

let cachedTeams: TeamMapping[] | null = null
let cacheExpiry = 0

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const competitionId = query.id || '341848806'
  const force = query.force === 'true'

  const now = Date.now()
  if (cachedTeams && now < cacheExpiry && !force) {
    return cachedTeams
  }

  try {
    const compData: any = await fcfFetch(`https://api-latam.analyticom.de/api/live/FCF/competition/${competitionId}`)
    if (!compData || !Array.isArray(compData.competitionElements)) {
      return []
    }

    const groups = compData.competitionElements.filter((el: any) => el.type === 'GROUP' || el.name.toLowerCase().includes('grupo'))

    // Fetch standings for all groups in parallel
    const teamsList: TeamMapping[] = []
    const promises = groups.map(async (group: any) => {
      try {
        const standings: any = await fcfFetch(`https://api-latam.analyticom.de/api/live/FCF/competition/${group.id}/standings/official?organizationIdFilter=329`)
        if (Array.isArray(standings)) {
          standings.forEach((row: any) => {
            if (row.team && row.team.name) {
              const teamNameLower = row.team.name.toLowerCase()
              // Skip "Descansa" teams from search list
              if (!teamNameLower.includes('descansa') && !teamNameLower.includes('libre')) {
                teamsList.push({
                  id: row.team.id,
                  name: row.team.name,
                  groupId: group.id,
                  groupName: group.name.split(' /')[0]
                })
              }
            }
          })
        }
      } catch (err) {
        console.error(`Error fetching standings for group ${group.id}:`, err)
      }
    })

    await Promise.all(promises)

    // Sort teams alphabetically
    teamsList.sort((a, b) => a.name.localeCompare(b.name))

    cachedTeams = teamsList
    cacheExpiry = now + 10 * 60 * 1000 // Cache for 10 minutes
    return teamsList
  } catch (error) {
    console.error('Error in all-teams api:', error)
    return cachedTeams || []
  }
})
