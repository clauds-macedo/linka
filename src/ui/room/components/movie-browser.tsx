import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Star, X } from 'lucide-react-native';
import { TMovie, TSeriesEpisode, MovieService } from '../../../domain/movie';
import { EVideoSource } from '../../../domain/room/enums';
import { EpisodePicker } from './episode-picker';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TMovieBrowserProps = {
  source: EVideoSource;
  onMovieSelect: (movie: TMovie) => void;
  onBack: () => void;
};

const sourceToStreamingId: Record<string, string> = {
  [EVideoSource.NETFLIX]: 'netflix',
  [EVideoSource.PRIME_VIDEO]: 'prime-video',
  [EVideoSource.DISNEY]: 'disney',
  [EVideoSource.MAX]: 'max',
  [EVideoSource.APPLE_TV]: 'apple-tv',
  [EVideoSource.PARAMOUNT]: 'paramount',
  [EVideoSource.GLOBOPLAY]: 'globoplay',
  [EVideoSource.CRUNCHYROLL]: 'crunchyroll',
  [EVideoSource.LINKA]: 'all',
};

const sourceLabels: Record<string, string> = {
  [EVideoSource.NETFLIX]: 'Netflix',
  [EVideoSource.PRIME_VIDEO]: 'Prime Video',
  [EVideoSource.DISNEY]: 'Disney+',
  [EVideoSource.MAX]: 'Max',
  [EVideoSource.APPLE_TV]: 'Apple TV+',
  [EVideoSource.PARAMOUNT]: 'Paramount+',
  [EVideoSource.GLOBOPLAY]: 'Globoplay',
  [EVideoSource.CRUNCHYROLL]: 'Crunchyroll',
  [EVideoSource.LINKA]: 'Todos',
};

export const MovieBrowser: React.FC<TMovieBrowserProps> = ({
  source,
  onMovieSelect,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<TMovie | null>(null);
  const [showEpisodePicker, setShowEpisodePicker] = useState(false);

  const streamingId = sourceToStreamingId[source] ?? 'all';
  const sourceLabel = sourceLabels[source] ?? 'Filmes';

  const movies = useMemo(() => {
    if (streamingId === 'all') {
      return MovieService.getAllMovies(200);
    }
    return MovieService.getMoviesByStreaming(streamingId, 200).movies;
  }, [streamingId]);

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return movies;
    const query = searchQuery.toLowerCase();
    return movies.filter((movie) => {
      const title = movie.tmdb?.title?.toLowerCase() ?? movie.name.toLowerCase();
      return title.includes(query);
    });
  }, [movies, searchQuery]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleMoviePress = useCallback((movie: TMovie) => {
    if (movie.type === 'series' && movie.episodes) {
      setSelectedSeries(movie);
      setShowEpisodePicker(true);
    } else {
      onMovieSelect(movie);
    }
  }, [onMovieSelect]);

  const handleEpisodeSelect = useCallback((episode: TSeriesEpisode, series: TMovie) => {
    setShowEpisodePicker(false);
    setSelectedSeries(null);
    const episodeMovie: TMovie = {
      ...series,
      url: episode.url,
      id: episode.id,
      name: episode.name || `${series.name} - T${Object.keys(series.episodes || {}).find(s => series.episodes?.[s]?.some(e => e.id === episode.id))} E${episode.episode}`,
    };
    onMovieSelect(episodeMovie);
  }, [onMovieSelect]);

  const handleCloseEpisodePicker = useCallback(() => {
    setShowEpisodePicker(false);
    setSelectedSeries(null);
  }, []);

  const renderMovie = useCallback(
    ({ item }: { item: TMovie }) => (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() => handleMoviePress(item)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.tmdb?.poster }}
          style={styles.moviePoster}
          resizeMode="cover"
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.tmdb?.title ?? item.name}
          </Text>
          {item.tmdb?.year && (
            <Text style={styles.movieYear}>{item.tmdb.year}</Text>
          )}
          {item.tmdb?.rating > 0 && (
            <View style={styles.ratingContainer}>
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{item.tmdb.rating.toFixed(1)}</Text>
            </View>
          )}
          {item.type === 'series' && (
            <View style={styles.seriesBadge}>
              <Text style={styles.seriesText}>Série</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    ),
    [handleMoviePress]
  );

  const keyExtractor = useCallback((item: TMovie) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ArrowLeft size={20} color={EColors.FOREGROUND} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sourceLabel}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={18} color={EColors.MUTED_FOREGROUND} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar filme ou série..."
            placeholderTextColor={EColors.MUTED_FOREGROUND}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <X size={18} color={EColors.MUTED_FOREGROUND} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.resultCount}>
        {filteredMovies.length} {filteredMovies.length === 1 ? 'resultado' : 'resultados'}
      </Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={EColors.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={filteredMovies}
          renderItem={renderMovie}
          keyExtractor={keyExtractor}
          numColumns={3}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum filme encontrado</Text>
            </View>
          }
        />
      )}

      <EpisodePicker
        visible={showEpisodePicker}
        series={selectedSeries}
        onClose={handleCloseEpisodePicker}
        onEpisodeSelect={handleEpisodeSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    borderBottomWidth: 1,
    borderBottomColor: EColors.BORDER,
  },
  backButton: {
    padding: ESpacing.SM,
    backgroundColor: EColors.SECONDARY,
    borderRadius: EBorderRadius.SM,
  },
  headerTitle: {
    flex: 1,
    fontSize: EFontSize.LG,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  searchContainer: {
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.MD,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.MD,
    paddingHorizontal: ESpacing.MD,
    gap: ESpacing.SM,
    borderWidth: 1,
    borderColor: EColors.BORDER,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: EFontSize.BASE,
    color: EColors.FOREGROUND,
  },
  resultCount: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    paddingHorizontal: ESpacing.MD,
    marginBottom: ESpacing.SM,
  },
  listContent: {
    paddingHorizontal: ESpacing.MD,
    paddingBottom: ESpacing.XXL,
  },
  columnWrapper: {
    gap: ESpacing.SM,
    marginBottom: ESpacing.SM,
  },
  movieCard: {
    flex: 1,
    maxWidth: '32%',
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.MD,
    overflow: 'hidden',
  },
  moviePoster: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  movieInfo: {
    padding: ESpacing.SM,
    gap: 2,
  },
  movieTitle: {
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.MEDIUM,
    color: EColors.FOREGROUND,
    lineHeight: EFontSize.XS * 1.3,
  },
  movieYear: {
    fontSize: 10,
    color: EColors.MUTED_FOREGROUND,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 10,
    color: EColors.FOREGROUND,
    fontWeight: EFontWeight.MEDIUM,
  },
  seriesBadge: {
    backgroundColor: EColors.PRIMARY,
    borderRadius: EBorderRadius.SM,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  seriesText: {
    fontSize: 8,
    color: EColors.FOREGROUND,
    fontWeight: EFontWeight.SEMIBOLD,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ESpacing.XXXXXL,
  },
  emptyText: {
    fontSize: EFontSize.BASE,
    color: EColors.MUTED_FOREGROUND,
  },
});
