import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Modal, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Film } from 'lucide-react-native';
import { Header } from './components/header.view';
import { Hero } from './components/hero.view';
import { LiveRoomCard } from './components/live-room-card.view';
import { MovieSection } from './components/movie-section.view';
import { Button, EButtonSize, EButtonVariant } from '../../../ui/components/button';
import { Card } from '../../../ui/components/card';
import { EpisodePicker } from '../../../ui/room/components/episode-picker';
import { EColors, ENeonColors, ESpacing, EFontSize, EFontWeight } from '../../../ui/tokens';
import { useHomeViewModel } from '../view-model/use-home.vm';
import { useI18n } from '../../../core/i18n';
import { TMovie } from '../../../domain/movie';
import { TLiveRoom } from '../../../domain/room/types';

type THomeSection =
  | { type: 'header'; key: string }
  | { type: 'auth'; key: string }
  | { type: 'featured'; key: string; movies: TMovie[] }
  | { type: 'category'; key: string; id: string; label: string; icon: string; movies: TMovie[] }
  | { type: 'rooms'; key: string; rooms: TLiveRoom[]; isLoading: boolean };

export const HomeView: React.FC = () => {
  const { t } = useI18n();
  const {
    rooms,
    featuredMovies,
    movieSections,
    isLoading,
    isCreatingRoom,
    isAuthenticated,
    selectedSeries,
    navigateToRoom,
    navigateToCreateRoom,
    navigateToMovie,
    navigateToSignIn,
    navigateToSignUp,
    refreshRooms,
    closeEpisodePicker,
    onEpisodeSelect,
  } = useHomeViewModel();

  const sections = useMemo<THomeSection[]>(() => {
    const items: THomeSection[] = [{ type: 'header', key: 'header' }];

    if (!isAuthenticated) {
      items.push({ type: 'auth', key: 'auth' });
    }

    if (featuredMovies.length > 0) {
      items.push({ type: 'featured', key: 'featured', movies: featuredMovies });
    }

    movieSections.forEach((section) => {
      items.push({
        type: 'category',
        key: `category-${section.id}`,
        id: section.id,
        label: section.label,
        icon: section.icon,
        movies: section.movies,
      });
    });

    items.push({ type: 'rooms', key: 'rooms', rooms, isLoading });

    return items;
  }, [isAuthenticated, featuredMovies, movieSections, rooms, isLoading]);

  const renderSection = useCallback(
    ({ item }: ListRenderItemInfo<THomeSection>) => {
      switch (item.type) {
        case 'header':
          return (
            <View style={styles.paddedContent}>
              <Header />
              <Hero onCreateRoom={navigateToCreateRoom} />
            </View>
          );

        case 'auth':
          return (
            <View style={styles.paddedContent}>
              <Card style={styles.authCard}>
                <View style={styles.authContent}>
                  <View style={styles.authTextBlock}>
                    <Text style={styles.authTitle}>{t('home.authTitle')}</Text>
                    <Text style={styles.authSubtitle}>{t('home.authSubtitle')}</Text>
                  </View>
                  <View style={styles.authActions}>
                    <Button.Root
                      variant={EButtonVariant.OUTLINE}
                      size={EButtonSize.SM}
                      onPress={navigateToSignIn}
                    >
                      <Button.Text>{t('home.signIn')}</Button.Text>
                    </Button.Root>
                    <Button.Root
                      variant={EButtonVariant.HERO}
                      size={EButtonSize.SM}
                      onPress={navigateToSignUp}
                    >
                      <Button.Text>{t('home.signUp')}</Button.Text>
                    </Button.Root>
                  </View>
                </View>
              </Card>
            </View>
          );

        case 'featured':
          return (
            <MovieSection
              title="Em Alta"
              icon="🔥"
              movies={item.movies}
              onMoviePress={navigateToMovie}
              cardSize="large"
            />
          );

        case 'category':
          return (
            <MovieSection
              title={item.label}
              icon={item.icon}
              movies={item.movies}
              onMoviePress={navigateToMovie}
            />
          );

        case 'rooms':
          return (
            <View style={styles.paddedContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('home.popularRooms')}</Text>
              </View>

              {item.isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={EColors.PRIMARY} />
                </View>
              ) : item.rooms.length === 0 ? (
                <Card style={styles.emptyCard}>
                  <View style={styles.emptyContent}>
                    <Film size={48} color={EColors.PRIMARY} strokeWidth={1.5} />
                    <Text style={styles.emptyTitle}>Nenhuma sala ativa</Text>
                    <Text style={styles.emptySubtitle}>
                      Seja o primeiro a criar uma sala e assistir com amigos!
                    </Text>
                    <Button.Root
                      variant={EButtonVariant.HERO}
                      size={EButtonSize.SM}
                      onPress={navigateToCreateRoom}
                    >
                      <Button.Text>Criar Sala</Button.Text>
                    </Button.Root>
                  </View>
                </Card>
              ) : (
                <View style={styles.roomsList}>
                  {item.rooms.map((room) => (
                    <LiveRoomCard key={room.id} room={room} onPress={navigateToRoom} />
                  ))}
                </View>
              )}
            </View>
          );

        default:
          return null;
      }
    },
    [navigateToCreateRoom, navigateToMovie, navigateToRoom, navigateToSignIn, navigateToSignUp, t]
  );

  const keyExtractor = useCallback((item: THomeSection) => item.key, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal visible={isCreatingRoom} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={EColors.PRIMARY} />
            <Text style={styles.modalText}>Criando sala...</Text>
          </View>
        </View>
      </Modal>

      <EpisodePicker
        visible={!!selectedSeries}
        series={selectedSeries}
        onEpisodeSelect={onEpisodeSelect}
        onClose={closeEpisodePicker}
      />

      <View style={styles.backgroundEffects}>
        <View style={styles.purpleBlob} />
        <View style={styles.blueBlob} />
      </View>

      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={keyExtractor}
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshRooms} tintColor={EColors.PRIMARY} />
        }
        initialNumToRender={3}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  backgroundEffects: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  purpleBlob: {
    position: 'absolute',
    top: -200,
    left: -200,
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: ENeonColors.PURPLE,
    opacity: 0.15,
  },
  blueBlob: {
    position: 'absolute',
    top: -100,
    right: -200,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: ENeonColors.BLUE,
    opacity: 0.1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: ESpacing.XXXL,
  },
  paddedContent: {
    paddingHorizontal: ESpacing.LG,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESpacing.LG,
  },
  sectionTitle: {
    fontSize: EFontSize.XL,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  loadingContainer: {
    paddingVertical: ESpacing.XXXXXL,
    alignItems: 'center',
  },
  roomsList: {
    gap: ESpacing.LG,
  },
  authCard: {
    marginBottom: ESpacing.XXXL,
  },
  authContent: {
    gap: ESpacing.LG,
  },
  authTextBlock: {
    gap: ESpacing.XS,
  },
  authTitle: {
    fontSize: EFontSize.XL,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  authSubtitle: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
  },
  authActions: {
    flexDirection: 'row',
    gap: ESpacing.SM,
  },
  emptyCard: {
    marginTop: ESpacing.MD,
  },
  emptyContent: {
    alignItems: 'center',
    gap: ESpacing.MD,
    paddingVertical: ESpacing.LG,
  },
  emptyTitle: {
    fontSize: EFontSize.LG,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  emptySubtitle: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: EColors.CARD,
    borderRadius: 16,
    padding: ESpacing.XXL,
    alignItems: 'center',
    gap: ESpacing.MD,
  },
  modalText: {
    fontSize: EFontSize.BASE,
    color: EColors.FOREGROUND,
    fontWeight: EFontWeight.MEDIUM,
  },
});
