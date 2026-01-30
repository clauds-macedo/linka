import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Film } from 'lucide-react-native';
import { Header } from './components/header.view';
import { Hero } from './components/hero.view';
import { LiveRoomCard } from './components/live-room-card.view';
import { ContentCard } from './components/content-card.view';
import { OfflineContentBrowser } from './components/offline-content-browser.view';
import { MovieSection } from './components/movie-section.view';
import { Button, EButtonSize, EButtonVariant } from '../../../ui/components/button';
import { Card } from '../../../ui/components/card';
import { EpisodePicker } from '../../../ui/room/components/episode-picker';
import { EColors, ENeonColors, ESpacing, EFontSize, EFontWeight } from '../../../ui/tokens';
import { useHomeViewModel } from '../view-model/use-home.vm';
import { useI18n } from '../../../core/i18n';

export const HomeView: React.FC = () => {
  const { t } = useI18n();
  const {
    rooms,
    premiumContent,
    featuredMovies,
    movieSections,
    isLoading,
    isCreatingRoom,
    isAuthenticated,
    navigateToRoom,
    navigateToCreateRoom,
    navigateToContent,
    navigateToMovie,
    navigateToSignIn,
    navigateToSignUp,
    refreshRooms,
    canAccessContent,
  } = useHomeViewModel();

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

      <View style={styles.backgroundEffects}>
        <View style={styles.purpleBlob} />
        <View style={styles.blueBlob} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshRooms} tintColor={EColors.PRIMARY} />
        }
      >
        <View style={styles.paddedContent}>
          <Header />
          <Hero onCreateRoom={navigateToCreateRoom} />
        </View>

        <OfflineContentBrowser />

        {!isAuthenticated && (
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
        )}

        {premiumContent.length > 0 && (
          <View style={styles.paddedContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.premiumContent')}</Text>
              <Text style={styles.viewAll}>{t('home.viewAll')}</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              style={styles.horizontalScrollView}
            >
              {premiumContent.map((content) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onPress={navigateToContent}
                  showLock={!canAccessContent(content)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {featuredMovies.length > 0 && (
          <MovieSection
            title="Em Alta"
            icon="🔥"
            movies={featuredMovies}
            onMoviePress={navigateToMovie}
            cardSize="large"
          />
        )}

        {movieSections.map((section) => (
          <MovieSection
            key={section.id}
            title={section.label}
            icon={section.icon}
            movies={section.movies}
            onMoviePress={navigateToMovie}
            onSeeAllPress={() => {}}
          />
        ))}

        <View style={styles.paddedContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.popularRooms')}</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={EColors.PRIMARY} />
            </View>
          ) : rooms.length === 0 ? (
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
              {rooms.map((room) => (
                <LiveRoomCard key={room.id} room={room} onPress={navigateToRoom} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
  viewAll: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
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
  horizontalScrollView: {
    marginBottom: ESpacing.XXXL,
  },
  horizontalList: {
    gap: ESpacing.LG,
    paddingRight: ESpacing.LG,
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
