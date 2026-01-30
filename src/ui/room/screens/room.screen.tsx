import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  ChevronLeft,
  Radio,
  Maximize2,
  Globe,
  Lock,
  Users,
} from 'lucide-react-native';
import { useRoomViewModel } from '../../../domain/room/view-models/use-room.vm';
import { useAuth } from '../../../core/auth';
import { useI18n } from '../../../core/i18n';
import { RoomControls } from '../components/room-controls';
import { RoomPlayer } from '../components/room-player';
import { StreamPlayer } from '../components/stream-player';
import { RoomChat } from '../components/room-chat';
import { ParticipantsList } from '../components/participants-list';
import { FullscreenControls } from '../components/fullscreen-controls';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type TRoomScreenProps = {
  roomId: string;
};

type TRoomVisibility = 'public' | 'friends' | 'private';

const VISIBILITY_CONFIG = {
  public: { icon: Globe, label: 'Público', color: '#4ade80' },
  friends: { icon: Users, label: 'Amigos', color: '#60a5fa' },
  private: { icon: Lock, label: 'Privado', color: '#f87171' },
};

export const RoomScreen: React.FC<TRoomScreenProps> = ({ roomId }) => {
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const userName = user?.name ?? 'Anônimo';
  const viewModel = useRoomViewModel(roomId, userId);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visibility, setVisibility] = useState<TRoomVisibility>('public');
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [localTime, setLocalTime] = useState(0);
  const [screenDimensions, setScreenDimensions] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions({ width: window.width, height: window.height });
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, [isFullscreen]);

  const handleFullscreenExit = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleVisibilityChange = useCallback((newVisibility: TRoomVisibility) => {
    setVisibility(newVisibility);
    setShowVisibilityMenu(false);
  }, []);

  const handleProgress = useCallback((time: number) => {
    setLocalTime(time);
    viewModel.handleProgress(time);
  }, [viewModel.handleProgress]);

  const handleSeekBy = useCallback(async (delta: number) => {
    const currentPlayerTime = await viewModel.streamPlayerRef.current?.getCurrentTime() ?? localTime;
    const nextTime = Math.max(0, currentPlayerTime + delta);
    await viewModel.streamPlayerRef.current?.seekTo(nextTime);
    if (viewModel.isHost) {
      viewModel.seekTo(nextTime);
    }
  }, [localTime, viewModel]);

  const VisibilityIcon = VISIBILITY_CONFIG[visibility].icon;

  const playerContainerStyle = useMemo(() => {
    if (isFullscreen) {
      return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: screenDimensions.width,
        height: screenDimensions.height,
        zIndex: 1000,
        backgroundColor: '#000',
      };
    }
    return {
      position: 'relative' as const,
      borderRadius: EBorderRadius.LG,
      overflow: 'hidden' as const,
    };
  }, [isFullscreen, screenDimensions]);

  if (!userId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.message}>{t('room.screen.authRequired')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (viewModel.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.message}>{t('room.screen.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (viewModel.error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.message}>{t('room.screen.error')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar hidden={isFullscreen} />

      {viewModel.isStreamVideo && (
        <View style={playerContainerStyle}>
          <StreamPlayer
            ref={viewModel.streamPlayerRef}
            videoUrl={viewModel.videoUrl}
            isPlaying={viewModel.isPlaying}
            currentTime={viewModel.currentTime}
            onStateChange={viewModel.handlePlayerStateChange}
            onProgress={handleProgress}
            isFullscreen={isFullscreen}
          />
          {isFullscreen && (
            <FullscreenControls
              isPlaying={viewModel.isPlaying}
              isHost={viewModel.isHost}
              currentTime={localTime}
              onPlay={viewModel.play}
              onPause={viewModel.pause}
              onSeekBackward={() => handleSeekBy(-10)}
              onSeekForward={() => handleSeekBy(10)}
              onExitFullscreen={handleFullscreenExit}
            />
          )}
          {!isFullscreen && (
            <TouchableOpacity style={styles.fullscreenToggle} onPress={toggleFullscreen}>
              <Maximize2 size={18} color={EColors.FOREGROUND} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {!isFullscreen && (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={24} color={EColors.FOREGROUND} />
              </TouchableOpacity>

              <View style={styles.headerInfo}>
                <Text style={styles.roomTitle} numberOfLines={1}>
                  Sala
                </Text>
                <View style={styles.statusRow}>
                  <View style={styles.liveBadge}>
                    <Radio size={10} color="#ef4444" />
                    <Text style={styles.liveText}>AO VIVO</Text>
                  </View>
                  <ParticipantsList
                    participants={viewModel.participants}
                    hostId={viewModel.hostId}
                    currentUserId={userId}
                  />
                </View>
              </View>

              <View style={styles.headerActions}>
                {viewModel.isHost && (
                  <View style={styles.visibilityContainer}>
                    <TouchableOpacity
                      style={[styles.visibilityButton, { borderColor: VISIBILITY_CONFIG[visibility].color }]}
                      onPress={() => setShowVisibilityMenu(!showVisibilityMenu)}
                    >
                      <VisibilityIcon size={14} color={VISIBILITY_CONFIG[visibility].color} />
                    </TouchableOpacity>

                    {showVisibilityMenu && (
                      <View style={styles.visibilityMenu}>
                        {(Object.keys(VISIBILITY_CONFIG) as TRoomVisibility[]).map((key) => {
                          const config = VISIBILITY_CONFIG[key];
                          const Icon = config.icon;
                          return (
                            <TouchableOpacity
                              key={key}
                              style={[
                                styles.visibilityOption,
                                visibility === key && styles.visibilityOptionActive,
                              ]}
                              onPress={() => handleVisibilityChange(key)}
                            >
                              <Icon size={16} color={config.color} />
                              <Text style={styles.visibilityOptionText}>{config.label}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                )}

                <View style={[styles.roleBadge, viewModel.isHost ? styles.hostBadge : styles.guestBadge]}>
                  <Text style={styles.roleText}>
                    {viewModel.isHost ? 'Host' : 'Viewer'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.playerSection}>
              {!viewModel.isStreamVideo && (
                <View style={styles.playerWrapper}>
                  <RoomPlayer
                    videoId={viewModel.videoId}
                    isPlaying={viewModel.isPlaying}
                    onStateChange={viewModel.handlePlayerStateChange}
                    onProgress={viewModel.handleProgress}
                    playerRef={viewModel.playerRef}
                  />
                </View>
              )}
              <RoomControls
                isHost={viewModel.isHost}
                isPlaying={viewModel.isPlaying}
                onPlay={viewModel.play}
                onPause={viewModel.pause}
                onSeekBackward={() => handleSeekBy(-10)}
                onSeekForward={() => handleSeekBy(10)}
              />
            </View>

            <View style={styles.chatSection}>
              <RoomChat
                roomId={roomId}
                userId={userId}
                userName={userName}
              />
            </View>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  safeArea: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESpacing.LG,
  },
  message: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.MEDIUM,
    color: EColors.MUTED_FOREGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    gap: ESpacing.MD,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: EBorderRadius.MD,
    backgroundColor: EColors.CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  roomTitle: {
    fontSize: EFontSize.LG,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.MD,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 2,
    borderRadius: EBorderRadius.SM,
  },
  liveText: {
    fontSize: 10,
    fontWeight: EFontWeight.BOLD,
    color: '#ef4444',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
  },
  visibilityContainer: {
    position: 'relative',
    zIndex: 100,
  },
  visibilityButton: {
    width: 36,
    height: 36,
    borderRadius: EBorderRadius.MD,
    backgroundColor: EColors.CARD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  visibilityMenu: {
    position: 'absolute',
    top: 44,
    right: 0,
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.MD,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    padding: ESpacing.XS,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
    paddingVertical: ESpacing.SM,
    paddingHorizontal: ESpacing.MD,
    borderRadius: EBorderRadius.SM,
  },
  visibilityOptionActive: {
    backgroundColor: EColors.SECONDARY,
  },
  visibilityOptionText: {
    fontSize: EFontSize.SM,
    color: EColors.FOREGROUND,
  },
  roleBadge: {
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.XS,
    borderRadius: EBorderRadius.FULL,
  },
  hostBadge: {
    backgroundColor: EColors.PRIMARY,
  },
  guestBadge: {
    backgroundColor: EColors.SECONDARY,
  },
  roleText: {
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  playerSection: {
    paddingHorizontal: ESpacing.MD,
  },
  playerWrapper: {
    position: 'relative',
    borderRadius: EBorderRadius.LG,
    overflow: 'hidden',
  },
  fullscreenToggle: {
    position: 'absolute',
    bottom: ESpacing.SM,
    right: ESpacing.SM,
    width: 36,
    height: 36,
    borderRadius: EBorderRadius.MD,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSection: {
    flex: 1,
    padding: ESpacing.MD,
  },
});
