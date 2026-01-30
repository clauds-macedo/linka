export type TMovieCastMember = {
  id: number;
  name: string;
  character: string;
  photo: string | null;
};

export type TMovieTmdb = {
  id: number;
  imdbId?: string;
  title: string;
  originalTitle: string;
  tagline: string | null;
  overview: string;
  status: string;
  language: string;
  releaseDate: string;
  year: string;
  runtime: number;
  rating: number;
  voteCount: number;
  popularity: number;
  certification: string | null;
  genres: string[];
  poster: string;
  posterHD: string;
  backdrop: string;
  backdropHD: string;
  logo: string | null;
  cast: TMovieCastMember[];
  directors: string[];
  writers: string[];
  keywords: string[];
  companies: string[];
  countries: string[];
  budget: number | null;
  revenue: number | null;
  collection: string | null;
  recommendations?: number[];
};

export type TSeriesEpisode = {
  episode: number;
  name: string;
  url: string;
  id: string;
  logo?: string;
};

export type TSeriesEpisodes = {
  [season: string]: TSeriesEpisode[];
};

export type TMovie = {
  id: string;
  name: string;
  url: string;
  category: string;
  type: 'movie' | 'series';
  isAdult: boolean;
  tmdb: TMovieTmdb;
  episodes?: TSeriesEpisodes;
};

export type TMovieCategory = {
  id: string;
  name: string;
  icon: string;
  movies: TMovie[];
};

export type TMovieListResponse = {
  movies: TMovie[];
  total: number;
};
