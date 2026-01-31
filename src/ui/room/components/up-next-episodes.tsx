import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { ChevronUp, Play, SkipForward, Clock, Check } from 'lucide-react-native';
import { TMovie, TSeriesEpisode } from '../../../domain/movie/types';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TEpisodeInfo = {
  season: string;
  episode: TSeriesEpisode;
  episodeIndex: number;
};

type TUpNextEpisodesProps = {
  series: TMovie | null;
  currentSeason: string;
  currentEpisode: number;
  autoplayEnabled: boolean;
  autoplayCountdown: number | null;
  onEpisodeSelect: (episode: TSeriesEpisode, season: string) => void;
  onAutoplayToggle: () => void;
  onCancelAutoplay: () => void;
  isHost: boolean;
};

type TEpisodeItemProps = {
  item: TEpisodeInfo;
  isNext: boolean;
  isCurrent: boolean;
  onPress: () => void;
};

const EpisodeItem: React.FC<TEpisodeItemProps> = ({ item, isNext, isCurrent, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.episodeItem,
        isNext && styles.episodeItemNext,
        isCurrent && styles.episodeItemCurrent,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.episodeThumbnailContainer}>
        {item.episode.logo ? (
          <Image
            source={{ uri: item.episode.logo }}
            style={styles.episodeThumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.episodeThumbnailPlaceholder}>
            <Play size={20} color={EColors.MUTED_FOREGROUND} />
          </View>
        )}
        {isNext && (
          <View style={styles.nextBadge}>
            <SkipForward size={12} color={EColors.FOREGROUND} />
          </View>
        )}
        {isCurrent && (
          <View style={styles.currentBadge}>
            <Check size={12} color={EColors.FOREGROUND} />
          </View>
        )}
      </View>
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeNumber}>
          T{item.season} E{item.episode.episode}
        </Text>
        <Text style={styles.episodeName} numberOfLines={2}>
          {item.episode.name}
        </Text>
      </View>
      <Play size={18} color={EColors.MUTED_FOREGROUND} />
    </TouchableOpacity>
  );
};

export const UpNextEpisodes: React.FC<TUpNextEpisodesProps> = ({
  series,
  currentSeason,
  currentEpisode,
  autoplayEnabled,
  autoplayCountdown,
  onEpisodeSelect,
  onAutoplayToggle,
  onCancelAutoplay,
  isHost,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandProgress = useSharedValue(0);

  useEffect(() => {
    expandProgress.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
  }, [isExpanded, expandProgress]);

  const upcomingEpisodes = useMemo(() => {
    if (!series?.episodes) return [];
    
    const episodes: TEpisodeInfo[] = [];
    const seasons = Object.keys(series.episodes).sort((a, b) => Number(a) - Number(b));
    
    let foundCurrent = false;
    
    for (const season of seasons) {
      const seasonEpisodes = series.episodes[season] || [];
      for (let i = 0; i < seasonEpisodes.length; i++) {
        const ep = seasonEpisodes[i];
        
        if (season === currentSeason && ep.episode === currentEpisode) {
          foundCurrent = true;
          continue;
        }
        
        if (foundCurrent) {
          episodes.push({
            season,
            episode: ep,
            episodeIndex: i,
          });
        }
      }
    }
    
    return episodes.slice(0, 10);
  }, [series, currentSeason, currentEpisode]);

  const nextEpisode = upcomingEpisodes[0];

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(expandProgress.value, [0, 1], [140, 400]),
  }));

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(expandProgress.value, [0, 1], [0, 180])}deg` }],
  }));

  const handleEpisodePress = useCallback(
    (item: TEpisodeInfo) => {
      if (isHost) {
        onEpisodeSelect(item.episode, item.season);
      }
    },
    [isHost, onEpisodeSelect]
  );

  const renderEpisode = useCallback(
    ({ item, index }: { item: TEpisodeInfo; index: number }) => (
      <EpisodeItem
        item={item}
        isNext={index === 0}
        isCurrent={false}
        onPress={() => handleEpisodePress(item)}
      />
    ),
    [handleEpisodePress]
  );

  const keyExtractor = useCallback((item: TEpisodeInfo) => item.episode.id, []);

  if (!series || series.type !== 'series' || upcomingEpisodes.length === 0) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <SkipForward size={18} color={EColors.PRIMARY} />
          <Text style={styles.headerTitle}>Próximos episódios</Text>
        </View>
        <Animated.View style={chevronAnimatedStyle}>
          <ChevronUp size={20} color={EColors.MUTED_FOREGROUND} />
        </Animated.View>
      </TouchableOpacity>

      {autoplayCountdown !== null && nextEpisode && (
        <View style={styles.autoplayBanner}>
          <View style={styles.autoplayInfo}>
            <Clock size={16} color={EColors.FOREGROUND} />
            <Text style={styles.autoplayText}>
              Próximo em {autoplayCountdown}s: T{nextEpisode.season} E{nextEpisode.episode.episode}
            </Text>
          </View>
          <TouchableOpacity onPress={onCancelAutoplay} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {isHost && (
        <TouchableOpacity
          style={styles.autoplayToggle}
          onPress={onAutoplayToggle}
          activeOpacity={0.7}
        >
          <View style={[styles.toggleSwitch, autoplayEnabled && styles.toggleSwitchActive]}>
            <View style={[styles.toggleThumb, autoplayEnabled && styles.toggleThumbActive]} />
          </View>
          <Text style={styles.autoplayToggleText}>Autoplay</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={upcomingEpisodes}
        renderItem={renderEpisode}
        keyExtractor={keyExtractor}
        horizontal={!isExpanded}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isExpanded ? styles.listContentVertical : styles.listContentHorizontal}
        style={styles.list}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.XL,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    overflow: 'hidden',
    marginTop: ESpacing.SM,
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
  },
  headerTitle: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  autoplayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: EColors.PRIMARY,
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
  },
  autoplayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
    flex: 1,
  },
  autoplayText: {
    fontSize: EFontSize.SM,
    color: EColors.FOREGROUND,
    flex: 1,
  },
  cancelButton: {
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.XS,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: EBorderRadius.SM,
  },
  cancelButtonText: {
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  autoplayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.XS,
    borderBottomWidth: 1,
    borderBottomColor: EColors.BORDER,
  },
  toggleSwitch: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: EColors.MUTED,
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: EColors.PRIMARY,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: EColors.FOREGROUND,
  },
  toggleThumbActive: {
    transform: [{ translateX: 18 }],
  },
  autoplayToggleText: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  list: {
    flex: 1,
  },
  listContentHorizontal: {
    paddingHorizontal: ESpacing.SM,
    paddingVertical: ESpacing.SM,
    gap: ESpacing.SM,
  },
  listContentVertical: {
    paddingHorizontal: ESpacing.SM,
    paddingVertical: ESpacing.SM,
    gap: ESpacing.XS,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EColors.SECONDARY,
    borderRadius: EBorderRadius.MD,
    padding: ESpacing.SM,
    gap: ESpacing.SM,
    width: SCREEN_WIDTH * 0.7,
  },
  episodeItemNext: {
    borderWidth: 1,
    borderColor: EColors.PRIMARY,
  },
  episodeItemCurrent: {
    opacity: 0.5,
  },
  episodeThumbnailContainer: {
    position: 'relative',
  },
  episodeThumbnail: {
    width: 80,
    height: 45,
    borderRadius: EBorderRadius.SM,
  },
  episodeThumbnailPlaceholder: {
    width: 80,
    height: 45,
    borderRadius: EBorderRadius.SM,
    backgroundColor: EColors.MUTED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: EColors.PRIMARY,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4ade80',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeInfo: {
    flex: 1,
    gap: 2,
  },
  episodeNumber: {
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.BOLD,
    color: EColors.PRIMARY,
  },
  episodeName: {
    fontSize: EFontSize.SM,
    color: EColors.FOREGROUND,
    lineHeight: 18,
  },
});
