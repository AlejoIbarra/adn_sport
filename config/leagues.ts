import type { LeagueConfig, SportConfig } from '../types/sports';

export const LEAGUES: LeagueConfig[] = [
  {
    id: 341848806,
    name: 'Primera C Colombia',
    slug: 'primera-c-colombia',
    sport: 'soccer',
    country: 'Colombia',
    featured: true,
    apiProvider: 'fcf'
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
    apiProvider: 'footballdata'
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
    apiProvider: 'footballdata'
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
    apiProvider: 'footballdata'
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
    apiProvider: 'footballdata'
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
    apiProvider: 'footballdata'
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
