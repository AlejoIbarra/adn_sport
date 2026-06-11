import type { LeagueConfig, SportConfig } from '../types/sports';

export const LEAGUES: LeagueConfig[] = [
  {
    id: 341848806,
    name: 'Primera C Colombia',
    slug: 'primera-c-colombia',
    sport: 'soccer',
    country: 'Colombia',
    featured: true,
    apiProvider: 'fcf',
    seoDescription: 'Sigue la Primera C de Colombia en vivo: tabla de posiciones, resultados, goleadores y calendario de partidos del fútbol de ascenso colombiano. La cobertura más completa en ADN Deportivo.',
    seoKeywords: 'Primera C Colombia, fútbol colombiano, ascenso Colombia, liga ascenso, resultados Primera C, tabla posiciones Primera C, goleadores Primera C',
    ogImage: '/og/primera-c.jpg',
    image: '/championships/primera-c.png'
  },
  {
    id: 2021,
    externalCode: 'PL',
    sofaId: 17,
    name: 'Premier League',
    slug: 'premier-league',
    sport: 'soccer',
    country: 'England',
    featured: true,
    apiProvider: 'footballdata',
    seoDescription: 'Premier League en vivo: resultados, tabla de posiciones, jornadas y estadísticas de los mejores equipos de Inglaterra. Manchester City, Arsenal, Liverpool y más en ADN Deportivo.',
    seoKeywords: 'Premier League, fútbol inglés, Premier League resultados, tabla Premier League, Premier League en vivo, Manchester City, Arsenal, Liverpool',
    ogImage: '/og/premier-league.jpg',
    image: '/championships/premier-league.png'
  },
  {
    id: 2014,
    externalCode: 'PD',
    sofaId: 8,
    name: 'La Liga',
    slug: 'la-liga',
    sport: 'soccer',
    country: 'Spain',
    featured: true,
    apiProvider: 'footballdata',
    seoDescription: 'La Liga española en vivo: resultados, tabla de posiciones, estadísticas y calendario de partidos. Real Madrid, Barcelona, Atlético y todos los equipos en ADN Deportivo.',
    seoKeywords: 'La Liga, fútbol español, La Liga resultados, tabla La Liga, Real Madrid, Barcelona, Atlético de Madrid, Liga española',
    ogImage: '/og/la-liga.jpg',
    image: '/championships/la-liga.png'
  },
  {
    id: 2019,
    externalCode: 'SA',
    sofaId: 23,
    name: 'Serie A',
    slug: 'serie-a',
    sport: 'soccer',
    country: 'Italy',
    featured: true,
    apiProvider: 'footballdata',
    seoDescription: 'Serie A italiana en vivo: resultados, clasificación y estadísticas completas. Inter, Juventus, AC Milan y todos los equipos del calcio italiano en ADN Deportivo.',
    seoKeywords: 'Serie A, calcio italiano, Serie A resultados, tabla Serie A, Juventus, Inter Milan, AC Milan, fútbol italiano',
    ogImage: '/og/serie-a.jpg',
    image: '/championships/serie-a.png'
  },
  {
    id: 2001,
    externalCode: 'CL',
    sofaId: 7,
    name: 'Champions League',
    slug: 'champions-league',
    sport: 'soccer',
    country: 'Europe',
    featured: true,
    apiProvider: 'footballdata',
    seoDescription: 'Champions League en vivo: resultados, fases, tabla de grupos y clasificación. Sigue el torneo de clubes más importante del mundo en ADN Deportivo con cobertura total.',
    seoKeywords: 'Champions League, UEFA Champions League, resultados Champions League, fases Champions League, final Champions League, fútbol europeo, Champions en vivo',
    ogImage: '/og/champions-league.jpg',
    image: '/championships/champions-league.png'
  },
  {
    id: 2146,
    externalCode: 'EL',
    sofaId: 677,
    name: 'Europa League',
    slug: 'europa-league',
    sport: 'soccer',
    country: 'Europe',
    featured: true,
    apiProvider: 'footballdata',
    seoDescription: 'Europa League en vivo: resultados, grupos, eliminatorias y estadísticas de la UEFA Europa League. Cobertura completa del segundo torneo de clubes europeo en ADN Deportivo.',
    seoKeywords: 'Europa League, UEFA Europa League, resultados Europa League, tabla Europa League, fases eliminatorias Europa League, fútbol europeo',
    ogImage: '/og/europa-league.jpg',
    image: '/championships/europa-league.png'
  },
  {
    id: 2000,
    externalCode: 'WC',
    sofaId: 4,
    name: 'Copa del Mundo',
    slug: 'copa-del-mundo',
    sport: 'soccer',
    country: 'Global',
    featured: true,
    apiProvider: 'footballdata',
    seoDescription: 'Sigue la Copa del Mundo en vivo: resultados, grupos, eliminatorias y estadísticas de la Copa Mundial de la FIFA en ADN Deportivo.',
    seoKeywords: 'Copa del Mundo, Mundial FIFA, resultados mundial, tabla mundial, partidos mundial',
    ogImage: '/og/mundial.jpg',
    image: '/championships/mundial.png'
  }
];

export const SPORTS: SportConfig[] = [
  {
    name: 'Fútbol',
    slug: 'soccer',
    leagues: LEAGUES.filter(l => l.sport === 'soccer')
  }
];

export const getLeagueBySlug = (slug: string) => LEAGUES.find(l => l.slug === slug);
