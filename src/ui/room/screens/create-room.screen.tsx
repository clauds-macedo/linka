import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../core/auth';
import { useI18n } from '../../../core/i18n';
import { EVideoSource } from '../../../domain/room/enums';
import { TMovie } from '../../../domain/movie';
import { RoomRealtimeService } from '../../../domain/room/services/room-realtime.service';
import { RoomRoot } from '../components/room-root';
import { SourceSelector } from '../components/source-selector';
import { YouTubeBrowser } from '../components/youtube-browser';
import { TwitchBrowser } from '../components/twitch-browser';
import { MovieBrowser } from '../components/movie-browser';
import { EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TCreateRoomScreenProps = {
  onCreated?: (roomId: string) => void;
  initialMovie?: TMovie;
};

type TScreenState =
  | 'select-source'
  | 'youtube-browser'
  | 'twitch-browser'
  | 'movie-browser'
  | 'creating';

const isStreamingSource = (source: EVideoSource): boolean => {
  return [
    EVideoSource.NETFLIX,
    EVideoSource.PRIME_VIDEO,
    EVideoSource.DISNEY,
    EVideoSource.MAX,
    EVideoSource.APPLE_TV,
    EVideoSource.PARAMOUNT,
    EVideoSource.GLOBOPLAY,
    EVideoSource.CRUNCHYROLL,
    EVideoSource.LINKA,
  ].includes(source);
};

export const CreateRoomScreen: React.FC<TCreateRoomScreenProps> = ({
  onCreated,
  initialMovie,
}) => {
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const [screenState, setScreenState] = useState<TScreenState>(
    initialMovie ? 'creating' : 'select-source'
  );
  const [selectedSource, setSelectedSource] = useState<EVideoSource | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createRoomWithContent = useCallback(
    async (contentId: string, contentUrl?: string) => {
      try {
        setScreenState('creating');
        setError(null);

        const roomId = await RoomRealtimeService.createRoom({
          hostId: userId,
          videoId: contentId,
          videoUrl: contentUrl,
        });

        if (!roomId) {
          setError(t('createRoom.error'));
          setScreenState('select-source');
          return;
        }

        if (onCreated) {
          onCreated(roomId);
          return;
        }

        router.replace(`/room/${roomId}`);
      } catch {
        setError(t('createRoom.error'));
        setScreenState('select-source');
      }
    },
    [userId, onCreated, router, t]
  );

  const handleSourceSelect = useCallback((source: EVideoSource) => {
    setSelectedSource(source);
    if (source === EVideoSource.YOUTUBE) {
      setScreenState('youtube-browser');
    } else if (source === EVideoSource.TWITCH) {
      setScreenState('twitch-browser');
    } else if (isStreamingSource(source)) {
      setScreenState('movie-browser');
    }
  }, []);

  const handleVideoSelect = useCallback(
    async (videoId: string) => {
      await createRoomWithContent(videoId);
    },
    [createRoomWithContent]
  );

  const handleMovieSelect = useCallback(
    async (movie: TMovie) => {
      await createRoomWithContent(movie.id, movie.url);
    },
    [createRoomWithContent]
  );

  const handleBack = useCallback(() => {
    setScreenState('select-source');
    setSelectedSource(null);
    setError(null);
  }, []);

  React.useEffect(() => {
    if (initialMovie) {
      handleMovieSelect(initialMovie);
    }
  }, [initialMovie, handleMovieSelect]);

  if (!userId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RoomRoot>
          <Text style={styles.message}>{t('createRoom.authRequired')}</Text>
        </RoomRoot>
      </SafeAreaView>
    );
  }

  if (screenState === 'youtube-browser') {
    return <YouTubeBrowser onVideoSelect={handleVideoSelect} onBack={handleBack} />;
  }

  if (screenState === 'twitch-browser') {
    return <TwitchBrowser onChannelSelect={handleVideoSelect} onBack={handleBack} />;
  }

  if (screenState === 'movie-browser' && selectedSource) {
    return (
      <MovieBrowser
        source={selectedSource}
        onMovieSelect={handleMovieSelect}
        onBack={handleBack}
      />
    );
  }

  if (screenState === 'creating') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={EColors.PRIMARY} />
          <Text style={styles.loadingText}>{t('createRoom.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RoomRoot>
          <Text style={styles.title}>{t('createRoom.title')}</Text>
          <Text style={styles.subtitle}>{t('createRoom.selectSource')}</Text>
          <SourceSelector onSelect={handleSourceSelect} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </RoomRoot>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  content: {
    padding: ESpacing.LG,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESpacing.MD,
  },
  loadingText: {
    fontSize: EFontSize.BASE,
    color: EColors.MUTED_FOREGROUND,
  },
  title: {
    fontSize: EFontSize.XXL,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  subtitle: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    marginBottom: ESpacing.MD,
  },
  message: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.MEDIUM,
    color: EColors.MUTED_FOREGROUND,
  },
  error: {
    fontSize: EFontSize.SM,
    color: EColors.DESTRUCTIVE,
    marginTop: ESpacing.SM,
  },
});
