import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../core/auth';
import { useI18n } from '../../../core/i18n';
import { EVideoSource } from '../../../domain/room/enums';
import { RoomRealtimeService } from '../../../domain/room/services/room-realtime.service';
import { RoomRoot } from '../components/room-root';
import { SourceSelector } from '../components/source-selector';
import { YouTubeBrowser } from '../components/youtube-browser';
import { EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TCreateRoomScreenProps = {
  onCreated?: (roomId: string) => void;
};

type TScreenState = 'select-source' | 'youtube-browser' | 'creating';

export const CreateRoomScreen: React.FC<TCreateRoomScreenProps> = ({ onCreated }) => {
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const [screenState, setScreenState] = useState<TScreenState>('select-source');
  const [error, setError] = useState<string | null>(null);

  const handleSourceSelect = useCallback((source: EVideoSource) => {
    if (source === EVideoSource.YOUTUBE) {
      setScreenState('youtube-browser');
    }
  }, []);

  const handleVideoSelect = useCallback(
    async (videoId: string) => {
      try {
        setScreenState('creating');
        setError(null);

        const roomId = await RoomRealtimeService.createRoom({
          hostId: userId,
          videoId,
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

  const handleBack = useCallback(() => {
    setScreenState('select-source');
    setError(null);
  }, []);

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
