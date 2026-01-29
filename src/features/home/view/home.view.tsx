import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './components/header.view';
import { Hero } from './components/hero.view';
import { RoomCard } from './components/room-card.view';
import { ContentCard } from './components/content-card.view';
import { EColors, ENeonColors, ESpacing, EFontSize, EFontWeight } from '../../../ui/tokens';
import { useHomeViewModel } from '../view-model/use-home.vm';

export const HomeView: React.FC = () => {
  const { 
    rooms, 
    premiumContent, 
    isLoading, 
    navigateToRoom, 
    navigateToCreateRoom, 
    navigateToContent,
    refreshRooms,
    canAccessContent,
  } = useHomeViewModel();

  return (
    <SafeAreaView style={styles.safeArea}>
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
        <Header />
        <Hero onCreateRoom={navigateToCreateRoom} />

        {premiumContent.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Conteúdo Premium</Text>
              <Text style={styles.viewAll}>Ver todos →</Text>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={EColors.PRIMARY} />
              </View>
            ) : (
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
            )}
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Salas Populares</Text>
          <Text style={styles.viewAll}>Ver todas →</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={EColors.PRIMARY} />
          </View>
        ) : (
          <View style={styles.roomsList}>
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onPress={navigateToRoom} />
            ))}
          </View>
        )}
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
    paddingHorizontal: ESpacing.LG,
    paddingBottom: ESpacing.XXXL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESpacing.XXL,
  },
  sectionTitle: {
    fontSize: EFontSize.XXL,
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
    gap: ESpacing.XXL,
  },
  horizontalScrollView: {
    marginBottom: ESpacing.XXXL,
  },
  horizontalList: {
    gap: ESpacing.LG,
    paddingRight: ESpacing.LG,
  },
});
