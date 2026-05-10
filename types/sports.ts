export interface LeagueConfig {
  id: number | string;
  seasonId?: number;
  sofaId?: number; // For SofaScore logos
  name: string;
  slug: string;
  sport: 'soccer' | 'basketball' | 'tennis';
  country?: string;
  image?: string;
  featured?: boolean;
  apiProvider: 'sofascore' | 'footballdata' | 'fcf';
  externalCode?: string; // For Football-Data.org (e.g. 'PL', 'CL')
  // SEO fields
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
}

export interface SportConfig {
  name: string;
  slug: string;
  leagues: LeagueConfig[];
}
