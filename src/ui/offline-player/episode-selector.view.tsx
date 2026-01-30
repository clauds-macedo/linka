import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { TOfflineContent, TEpisode } from '../../../domain/content/types';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TEpisodeSelectorProps = {
  content: TOfflineContent;
  onSelectEpisode: (episode: TEpisode) => void;
  onClose: () => void;
};

export const EpisodeSelector: React.FC<TEpisodeSelectorProps> = ({
  content,
  onSelectEpisode,
  onClose,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>('1');

  if (!content.episodes) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Série sem episódios disponíveis</Text>
        </View>
      </SafeAreaView>
    );
  }

  const seasons = Object.keys(content.episodes).sort((a, b) => Number(a) - Number(b));
  const currentSeasonEpisodes = content.episodes[selectedSeason] || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <ChevronLeft size={24} color={EColors.FOREGROUND} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {content.name}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentPadding}
          showsVerticalScrollIndicator={false}
        >
          {/* Season Selector */}
          {seasons.length > 1 && (
            <View style={styles.seasonContainer}>
              <Text style={styles.sectionTitle}>Temporadas</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.seasonList}
              >
                {seasons.map((season) => (
                  <TouchableOpacity
                    key={season}
                    style={[
                      styles.seasonButton,
                      selectedSeason === season && styles.seasonButtonActive,
                    ]}
                    onPress={() => setSelectedSeason(season)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.seasonButtonText,
                        selectedSeason === season && styles.seasonButtonTextActive,
                      ]}
                    >
                      T{season}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Episodes List */}
          <View style={styles.episodesContainer}>
            <Text style={styles.sectionTitle}>
              Episódios - Temporada {selectedSeason}
            </Text>
            {currentSeasonEpisodes.map((episode: TEpisode) => (
              <TouchableOpacity
                key={episode.id}
                style={styles.episodeCard}
                onPress={() => onSelectEpisode(episode)}
                activeOpacity={0.7}
              >
                <View style={styles.episodeNumber}>
                  <Text style={styles.episodeNumberText}>E{episode.episode}</Text>
                </View>
                <View style={styles.episodeInfo}>
                  <Text style={styles.episodeName} numberOfLines={2}>
                    {episode.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  container: {
    flex: 1,
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
  backButton: {
    padding: ESpacing.SM,
  },
  title: {
    flex: 1,
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
    marginHorizontal: ESpacing.MD,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: ESpacing.MD,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: EFontSize.BASE,
    color: EColors.MUTED_FOREGROUND,
  },
  seasonContainer: {
    marginBottom: ESpacing.LG,
  },
  sectionTitle: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
    marginBottom: ESpacing.MD,
  },
  seasonList: {
    gap: ESpacing.SM,
  },
  seasonButton: {
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    borderRadius: EBorderRadius.MD,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    backgroundColor: EColors.CARD,
  },
  seasonButtonActive: {
    backgroundColor: EColors.PRIMARY,
    borderColor: EColors.PRIMARY,
  },
  seasonButtonText: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.MUTED_FOREGROUND,
  },
  seasonButtonTextActive: {
    color: EColors.FOREGROUND,
  },
  episodesContainer: {
    gap: ESpacing.SM,
  },
  episodeCard: {
    flexDirection: 'row',
    padding: ESpacing.MD,
    borderRadius: EBorderRadius.MD,
    backgroundColor: EColors.CARD,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    gap: ESpacing.MD,
    marginBottom: ESpacing.SM,
  },
  episodeNumber: {
    width: 50,
    height: 50,
    borderRadius: EBorderRadius.MD,
    backgroundColor: EColors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeNumberText: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  episodeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  episodeName: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
});
