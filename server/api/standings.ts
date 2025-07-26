export default defineEventHandler(async () => {
  type Match = {
    homeTeam: {
      name: string
      picture: string
      result: { current: number }
    }
    awayTeam: {
      name: string
      picture: string
      result: { current: number }
    }
    homeTeamResult: { current: number }
    awayTeamResult: { current: number }
  }

  type ApiResponse = {
    result: Match[]
  }

  const apiKey = process.env.API_KEY
  if (!apiKey) {
    throw new Error('API_KEY no está definido en el entorno')
  }

  const res = await $fetch<ApiResponse>(
    'https://api-latam.analyticom.de/api/live/FCF/competition/274811838/matches/paginated/past/0?page=1&pageSize=1000',
    {
      method: 'GET',
      headers: {
        'api_key': apiKey
      }
    }
  )

  const matches = res.result
  const standings = new Map<string, any>()

  for (const match of matches) {
    const home = match.homeTeam.name
    const away = match.awayTeam.name
    if (home.toUpperCase() === "DESCANSA" || away.toUpperCase() === "DESCANSA") continue
    const hg = match.homeTeamResult?.current ?? 0
    const ag = match.awayTeamResult?.current ?? 0

    const init = (name: string, picture: string) => {
      if (!standings.has(name)) {
        standings.set(name, {
          name,
          picture,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          gf: 0,
          ga: 0,
          gd: 0,
          points: 0
        })
      }
    }

    init(home, match.homeTeam.picture)
    init(away, match.awayTeam.picture)

    const tHome = standings.get(home)
    const tAway = standings.get(away)

    tHome.played++
    tAway.played++
    tHome.gf += hg
    tHome.ga += ag
    tAway.gf += ag
    tAway.ga += hg

    if (hg > ag) {
      tHome.won++
      tHome.points += 3
      tAway.lost++
    } else if (hg < ag) {
      tAway.won++
      tAway.points += 3
      tHome.lost++
    } else {
      tHome.drawn++
      tAway.drawn++
      tHome.points++
      tAway.points++
    }

    tHome.gd = tHome.gf - tHome.ga
    tAway.gd = tAway.gf - tAway.ga
  }

  return Array.from(standings.values()).sort((a, b) =>
    b.points - a.points || b.gd - a.gd || b.gf - a.gf
  )
})
