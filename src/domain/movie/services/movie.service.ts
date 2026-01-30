import { TMovie, TMovieListResponse } from '../types';

type TMovieDataset = {
  id: string;
  label: string;
  icon: string;
  loader: () => TMovie[];
};

export type TStreamingService = {
  id: string;
  label: string;
  color: string;
  loader: () => TMovie[];
};

const loadJson = (path: string): TMovie[] => {
  try {
    switch (path) {
      case 'acao':
        return require('../../../../saimo_data/acao.json') as TMovie[];
      case 'comedia':
        return require('../../../../saimo_data/comedia.json') as TMovie[];
      case 'drama':
        return require('../../../../saimo_data/drama.json') as TMovie[];
      case 'terror':
        return require('../../../../saimo_data/terror.json') as TMovie[];
      case 'romance':
        return require('../../../../saimo_data/romance.json') as TMovie[];
      case 'crunchyroll':
        return require('../../../../saimo_data/crunchyroll.json') as TMovie[];
      case 'suspense':
        return require('../../../../saimo_data/suspense.json') as TMovie[];
      case 'fantasia':
        return require('../../../../saimo_data/fantasia.json') as TMovie[];
      case 'netflix':
        return require('../../../../saimo_data/netflix.json') as TMovie[];
      case 'prime-video':
        return require('../../../../saimo_data/prime-video.json') as TMovie[];
      case 'disney':
        return require('../../../../saimo_data/disney.json') as TMovie[];
      case 'max':
        return require('../../../../saimo_data/max.json') as TMovie[];
      case 'apple-tv':
        return require('../../../../saimo_data/apple-tv.json') as TMovie[];
      case 'paramount':
        return require('../../../../saimo_data/paramount.json') as TMovie[];
      case 'globoplay':
        return require('../../../../saimo_data/globoplay.json') as TMovie[];
      default:
        return [];
    }
  } catch {
    return [];
  }
};

const datasets: TMovieDataset[] = [
  { id: 'acao', label: 'Ação', icon: '💥', loader: () => loadJson('acao') },
  { id: 'comedia', label: 'Comédia', icon: '😂', loader: () => loadJson('comedia') },
  { id: 'drama', label: 'Drama', icon: '🎭', loader: () => loadJson('drama') },
  { id: 'terror', label: 'Terror', icon: '👻', loader: () => loadJson('terror') },
  { id: 'romance', label: 'Romance', icon: '❤️', loader: () => loadJson('romance') },
  { id: 'anime', label: 'Animes', icon: '🎌', loader: () => loadJson('crunchyroll') },
  { id: 'suspense', label: 'Suspense', icon: '🔍', loader: () => loadJson('suspense') },
  { id: 'fantasia', label: 'Fantasia', icon: '🧙', loader: () => loadJson('fantasia') },
];

const streamingServices: TStreamingService[] = [
  { id: 'netflix', label: 'Netflix', color: '#E50914', loader: () => loadJson('netflix') },
  { id: 'prime-video', label: 'Prime Video', color: '#00A8E1', loader: () => loadJson('prime-video') },
  { id: 'disney', label: 'Disney+', color: '#113CCF', loader: () => loadJson('disney') },
  { id: 'max', label: 'Max', color: '#002BE7', loader: () => loadJson('max') },
  { id: 'apple-tv', label: 'Apple TV+', color: '#000000', loader: () => loadJson('apple-tv') },
  { id: 'paramount', label: 'Paramount+', color: '#0064FF', loader: () => loadJson('paramount') },
  { id: 'globoplay', label: 'Globoplay', color: '#F72B2B', loader: () => loadJson('globoplay') },
  { id: 'crunchyroll', label: 'Crunchyroll', color: '#F47521', loader: () => loadJson('crunchyroll') },
];

export class MovieService {
  static getCategories() {
    return datasets.map((dataset) => ({
      id: dataset.id,
      label: dataset.label,
      icon: dataset.icon,
    }));
  }

  static getMoviesByCategory(categoryId: string, limit = 20): TMovieListResponse {
    const dataset = datasets.find((d) => d.id === categoryId);
    if (!dataset) {
      return { movies: [], total: 0 };
    }

    const data = dataset.loader();
    const movies = data
      .filter((movie) => !movie.isAdult && movie.tmdb?.poster)
      .slice(0, limit);

    return {
      movies,
      total: data.length,
    };
  }

  static getFeaturedMovies(limit = 10): TMovie[] {
    const allMovies = datasets.flatMap((d) => d.loader());
    return allMovies
      .filter((movie) => !movie.isAdult && movie.tmdb?.poster && movie.tmdb.rating >= 7)
      .sort((a, b) => (b.tmdb?.rating ?? 0) - (a.tmdb?.rating ?? 0))
      .slice(0, limit);
  }

  static getMovieById(id: string): TMovie | null {
    for (const dataset of datasets) {
      const data = dataset.loader();
      const movie = data.find((m) => m.id === id);
      if (movie) return movie;
    }
    for (const service of streamingServices) {
      const data = service.loader();
      const movie = data.find((m) => m.id === id);
      if (movie) return movie;
    }
    return null;
  }

  static searchMovies(query: string, limit = 20): TMovie[] {
    const normalizedQuery = query.toLowerCase().trim();
    const allMovies = datasets.flatMap((d) => d.loader());

    return allMovies
      .filter((movie) => {
        const title = movie.tmdb?.title?.toLowerCase() ?? movie.name.toLowerCase();
        return title.includes(normalizedQuery) && !movie.isAdult && movie.tmdb?.poster;
      })
      .slice(0, limit);
  }

  static getRecommendations(movieId: string, limit = 10): TMovie[] {
    const movie = this.getMovieById(movieId);
    if (!movie) return [];

    const genres = movie.tmdb?.genres ?? [];
    const allMovies = datasets.flatMap((d) => d.loader());

    return allMovies
      .filter((m) => {
        if (m.id === movieId || m.isAdult || !m.tmdb?.poster) return false;
        const movieGenres = m.tmdb?.genres ?? [];
        return movieGenres.some((g) => genres.includes(g));
      })
      .sort((a, b) => (b.tmdb?.rating ?? 0) - (a.tmdb?.rating ?? 0))
      .slice(0, limit);
  }

  static getStreamingServices() {
    return streamingServices.map((service) => ({
      id: service.id,
      label: service.label,
      color: service.color,
    }));
  }

  static getMoviesByStreaming(streamingId: string, limit = 50): TMovieListResponse {
    const service = streamingServices.find((s) => s.id === streamingId);
    if (!service) {
      return { movies: [], total: 0 };
    }

    const data = service.loader();
    const movies = data
      .filter((movie) => !movie.isAdult && movie.tmdb?.poster)
      .slice(0, limit);

    return {
      movies,
      total: data.length,
    };
  }

  static getAllMovies(limit = 100): TMovie[] {
    const allMovies = [
      ...datasets.flatMap((d) => d.loader()),
      ...streamingServices.flatMap((s) => s.loader()),
    ];

    const uniqueMovies = allMovies.reduce((acc, movie) => {
      if (!acc.find((m) => m.id === movie.id)) {
        acc.push(movie);
      }
      return acc;
    }, [] as TMovie[]);

    return uniqueMovies
      .filter((movie) => !movie.isAdult && movie.tmdb?.poster)
      .sort((a, b) => (b.tmdb?.rating ?? 0) - (a.tmdb?.rating ?? 0))
      .slice(0, limit);
  }
}
