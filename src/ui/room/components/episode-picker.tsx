import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Play, ChevronDown } from 'lucide-react-native';
import { TMovie, TSeriesEpisode } from '../../../domain/movie/types';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type TEpisodePickerProps = {
  visible: boolean;
  series: TMovie | null;
  onClose: () => void;
  onEpisodeSelect: (episode: TSeriesEpisode, series: TMovie) => void;
};

export const EpisodePicker: React.FC<TEpisodePickerProps> = ({
  visible,
  series,
  onClose,
  onEpisodeSelect,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>('1');
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);

  const seasons = useMemo(() => {
    if (!series?.episodes) return [];
    return Object.keys(series.episodes).sort((a, b) => Number(a) - Number(b));
  }, [series]);

  const episodes = useMemo(() => {
    if (!series?.episodes || !selectedSeason) return [];
    return series.episodes[selectedSeason] || [];
  }, [series, selectedSeason]);

  React.useEffect(() => {
    if (seasons.length > 0 && !seasons.includes(selectedSeason)) {
      setSelectedSeason(seasons[0]);
    }
  }, [seasons, selectedSeason]);

  if (!series) return null;

  const backdropUrl = series.tmdb?.backdrop || series.tmdb?.backdropHD;
  const posterUrl = series.tmdb?.poster || series.tmdb?.posterHD;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.heroContainer}>
          {backdropUrl ? (
            <ImageBackground
              source={{ uri: backdropUrl }}
              style={styles.heroBackdrop}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['transparent', EColors.BACKGROUND]}
                style={styles.heroGradient}
              />
            </ImageBackground>
          ) : (
            <View style={[styles.heroBackdrop, { backgroundColor: EColors.CARD }]}>
              <LinearGradient
                colors={['transparent', EColors.BACKGROUND]}
                style={styles.heroGradient}
              />
            </View>
          )}
          <SafeAreaView style={styles.headerOverlay}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={EColors.FOREGROUND} />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.heroContent}>
            {posterUrl && (
              <Image
                source={{ uri: posterUrl }}
                style={styles.poster}
                resizeMode="cover"
              />
            )}
            <View style={styles.infoContent}>
              <Text style={styles.seriesTitle}>{series.tmdb?.title || series.name}</Text>
              {series.tmdb?.year && <Text style={styles.seriesYear}>{series.tmdb.year}</Text>}
              {series.tmdb?.rating && (
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>⭐ {series.tmdb.rating.toFixed(1)}</Text>
                </View>
              )}
              {series.tmdb?.genres && series.tmdb.genres.length > 0 && (
                <Text style={styles.genres} numberOfLines={2}>
                  {series.tmdb.genres.slice(0, 3).join(' • ')}
                </Text>
              )}
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {series.tmdb?.overview && (
            <Text style={styles.overview} numberOfLines={3}>
              {series.tmdb.overview}
            </Text>
          )}

          <View style={styles.seasonSelector}>
            <TouchableOpacity
              style={styles.seasonDropdown}
              onPress={() => setShowSeasonDropdown(!showSeasonDropdown)}
            >
              <Text style={styles.seasonText}>Temporada {selectedSeason}</Text>
              <ChevronDown size={20} color={EColors.FOREGROUND} />
            </TouchableOpacity>

            {showSeasonDropdown && (
              <View style={styles.dropdownMenu}>
                {seasons.map((season) => (
                  <TouchableOpacity
                    key={season}
                    style={[
                      styles.dropdownItem,
                      selectedSeason === season && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedSeason(season);
                      setShowSeasonDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedSeason === season && styles.dropdownItemTextSelected,
                      ]}
                    >
                      Temporada {season}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.episodesList}>
            {episodes.map((episode) => {
              const episodeThumbnail = episode.logo || series.tmdb?.backdrop || series.tmdb?.poster;
              
              return (
                <TouchableOpacity
                  key={episode.id}
                  style={styles.episodeCard}
                  onPress={() => onEpisodeSelect(episode, series)}
                >
                  <View style={styles.episodeThumbnail}>
                    {episodeThumbnail ? (
                      <Image
                        source={{ uri: episodeThumbnail }}
                        style={styles.episodeImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.episodePlaceholder}>
                        <Play size={24} color={EColors.PRIMARY} />
                      </View>
                    )}
                    <View style={styles.episodeNumber}>
                      <Text style={styles.episodeNumberText}>{episode.episode}</Text>
                    </View>
                  </View>
                  <View style={styles.episodeInfo}>
                    <Text style={styles.episodeTitle} numberOfLines={2}>
                      {episode.name || `Episódio ${episode.episode}`}
                    </Text>
                    <Text style={styles.episodeSubtitle}>
                      T{selectedSeason} E{episode.episode}
                    </Text>
                  </View>
                  <View style={styles.playButton}>
                    <Play size={20} color={EColors.PRIMARY} fill={EColors.PRIMARY} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  heroContainer: {
    height: SCREEN_HEIGHT * 0.35,
    position: 'relative',
  },
  heroBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
    margin: ESpacing.MD,
  },
  heroContent: {
    position: 'absolute',
    bottom: ESpacing.LG,
    left: ESpacing.LG,
    right: ESpacing.LG,
    flexDirection: 'row',
    gap: ESpacing.MD,
  },
  poster: {
    width: 90,
    height: 135,
    borderRadius: EBorderRadius.MD,
    backgroundColor: EColors.CARD,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: ESpacing.XS,
  },
  seriesTitle: {
    fontSize: EFontSize.XL,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  seriesYear: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: EFontSize.SM,
    color: EColors.FOREGROUND,
  },
  genres: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  content: {
    flex: 1,
    padding: ESpacing.LG,
  },
  overview: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    lineHeight: 20,
    marginBottom: ESpacing.LG,
  },
  seasonSelector: {
    marginBottom: ESpacing.LG,
    zIndex: 10,
  },
  seasonDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: EColors.CARD,
    paddingHorizontal: ESpacing.LG,
    paddingVertical: ESpacing.MD,
    borderRadius: EBorderRadius.MD,
    borderWidth: 1,
    borderColor: EColors.BORDER,
  },
  seasonText: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.MD,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: ESpacing.LG,
    paddingVertical: ESpacing.MD,
    borderBottomWidth: 1,
    borderBottomColor: EColors.BORDER,
  },
  dropdownItemSelected: {
    backgroundColor: EColors.PRIMARY + '20',
  },
  dropdownItemText: {
    fontSize: EFontSize.BASE,
    color: EColors.FOREGROUND,
  },
  dropdownItemTextSelected: {
    color: EColors.PRIMARY,
    fontWeight: EFontWeight.SEMIBOLD,
  },
  episodesList: {
    gap: ESpacing.MD,
    paddingBottom: ESpacing.XXXL,
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.MD,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    overflow: 'hidden',
  },
  episodeThumbnail: {
    width: 120,
    height: 68,
    backgroundColor: EColors.MUTED,
    position: 'relative',
  },
  episodeImage: {
    width: '100%',
    height: '100%',
  },
  episodePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EColors.MUTED,
  },
  episodeNumber: {
    position: 'absolute',
    top: ESpacing.XS,
    left: ESpacing.XS,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 2,
    borderRadius: EBorderRadius.SM,
  },
  episodeNumberText: {
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  episodeInfo: {
    flex: 1,
    padding: ESpacing.MD,
    gap: ESpacing.XS,
  },
  episodeTitle: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.MEDIUM,
    color: EColors.FOREGROUND,
  },
  episodeSubtitle: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  playButton: {
    padding: ESpacing.MD,
  },
});
