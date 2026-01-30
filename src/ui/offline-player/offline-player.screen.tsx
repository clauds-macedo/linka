import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { TOfflineContent, TEpisode } from '../../../domain/content/types';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TOfflinePlayerScreenProps = {
  content: TOfflineContent;
  episode?: TEpisode;
};

export const OfflinePlayerScreen: React.FC<TOfflinePlayerScreenProps> = ({
  content,
  episode,
}) => {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);

  const currentEpisode = episode || (
    content.type === 'movie' && content.url
      ? {
          episode: 1,
          name: content.name,
          url: content.url,
          id: content.id,
          logo: content.tmdb.poster,
        }
      : null
  );

  if (!currentEpisode) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Conteúdo indisponível</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={EColors.FOREGROUND} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {content.name}
          </Text>
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={20} color={EColors.FOREGROUND} />
          </TouchableOpacity>
        </View>

        <View style={styles.playerContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri: currentEpisode.url }}
            style={styles.webview}
            allowsFullscreenVideo
            javaScriptEnabled
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState
            scalesPageToFit
          />
        </View>

        <ScrollView style={styles.infoContainer} contentContainerStyle={styles.infoContent}>
          <View>
            <Text style={styles.contentTitle}>{content.name}</Text>
            {content.type === 'series' && (
              <Text style={styles.episodeTitle}>{currentEpisode.name}</Text>
            )}
            <View style={styles.metadata}>
              <Text style={styles.metadataText}>
                {content.type === 'movie' ? 'Filme' : 'Série'} • {content.tmdb.year}
              </Text>
              <Text style={styles.rating}>⭐ {content.tmdb.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.description}>{content.tmdb.overview}</Text>

            {content.tmdb.genres && (
              <View style={styles.genresContainer}>
                {content.tmdb.genres.map((genre: string, index: number) => (
                  <View key={index} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            )}

            {content.tmdb.cast && content.tmdb.cast.length > 0 && (
              <View style={styles.castContainer}>
                <Text style={styles.sectionTitle}>Elenco</Text>
                <Text style={styles.castList}>
                  {content.tmdb.cast.slice(0, 5).map((actor: any) => actor.name).join(', ')}
                </Text>
              </View>
            )}
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
  },
  shareButton: {
    padding: ESpacing.SM,
  },
  playerContainer: {
    height: 250,
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.MD,
    overflow: 'hidden',
    margin: ESpacing.MD,
  },
  webview: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
  },
  infoContent: {
    padding: ESpacing.MD,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: EFontSize.LG,
    color: EColors.MUTED_FOREGROUND,
  },
  contentTitle: {
    fontSize: EFontSize.XL,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
    marginBottom: ESpacing.SM,
  },
  episodeTitle: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    marginBottom: ESpacing.SM,
    fontStyle: 'italic',
  },
  metadata: {
    flexDirection: 'row',
    gap: ESpacing.MD,
    marginBottom: ESpacing.MD,
  },
  metadataText: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
  },
  rating: {
    fontSize: EFontSize.SM,
    color: EColors.PRIMARY,
    fontWeight: EFontWeight.SEMIBOLD,
  },
  description: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    lineHeight: 20,
    marginBottom: ESpacing.MD,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESpacing.XS,
    marginBottom: ESpacing.MD,
  },
  genreTag: {
    paddingHorizontal: ESpacing.SM,
    paddingVertical: ESpacing.XS,
    borderRadius: EBorderRadius.MD,
    backgroundColor: EColors.CARD,
    borderWidth: 1,
    borderColor: EColors.BORDER,
  },
  genreText: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  castContainer: {
    marginTop: ESpacing.LG,
  },
  sectionTitle: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
    marginBottom: ESpacing.SM,
  },
  castList: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    lineHeight: 20,
  },
});
