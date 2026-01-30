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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Play, ChevronDown } from 'lucide-react-native';
import { TMovie, TSeriesEpisode } from '../../../domain/movie/types';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={EColors.FOREGROUND} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {series.tmdb.title}
          </Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.seriesInfo}>
            <Image
              source={{ uri: series.tmdb.poster }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.infoContent}>
              <Text style={styles.seriesTitle}>{series.tmdb.title}</Text>
              <Text style={styles.seriesYear}>{series.tmdb.year}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {series.tmdb.rating.toFixed(1)}</Text>
              </View>
              <Text style={styles.genres} numberOfLines={2}>
                {series.tmdb.genres.slice(0, 3).join(' • ')}
              </Text>
            </View>
          </View>

          <Text style={styles.overview} numberOfLines={3}>
            {series.tmdb.overview}
          </Text>

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
            {episodes.map((episode) => (
              <TouchableOpacity
                key={episode.id}
                style={styles.episodeCard}
                onPress={() => onEpisodeSelect(episode, series)}
              >
                <View style={styles.episodeThumbnail}>
                  {episode.logo ? (
                    <Image
                      source={{ uri: episode.logo }}
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
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    borderBottomWidth: 1,
    borderBottomColor: EColors.BORDER,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: EFontSize.LG,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: ESpacing.LG,
  },
  seriesInfo: {
    flexDirection: 'row',
    gap: ESpacing.LG,
    marginBottom: ESpacing.LG,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: EBorderRadius.MD,
    backgroundColor: EColors.CARD,
  },
  infoContent: {
    flex: 1,
    gap: ESpacing.XS,
  },
  seriesTitle: {
    fontSize: EFontSize.XL,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
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
  overview: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    lineHeight: 20,
    marginBottom: ESpacing.XL,
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
