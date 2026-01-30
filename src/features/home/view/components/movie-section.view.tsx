import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ListRenderItemInfo } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { TMovie } from '../../../../domain/movie';
import { EColors, ESpacing, EFontSize, EFontWeight } from '../../../../ui/tokens';
import { MovieCard } from './movie-card.view';

export type TMovieSectionProps = {
  title: string;
  icon?: string;
  movies: TMovie[];
  onMoviePress: (movie: TMovie) => void;
  onSeeAllPress?: () => void;
  cardSize?: 'default' | 'large';
};

const MovieSectionComponent: React.FC<TMovieSectionProps> = ({
  title,
  icon,
  movies,
  onMoviePress,
  onSeeAllPress,
  cardSize = 'default',
}) => {
  const renderMovie = useCallback(
    ({ item }: ListRenderItemInfo<TMovie>) => (
      <MovieCard movie={item} onPress={onMoviePress} size={cardSize} />
    ),
    [onMoviePress, cardSize]
  );

  const keyExtractor = useCallback((item: TMovie) => item.id, []);

  if (movies.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
        {onSeeAllPress && (
          <Pressable style={styles.seeAllButton} onPress={onSeeAllPress}>
            <Text style={styles.seeAllText}>Ver mais</Text>
            <ChevronRight size={16} color={EColors.MUTED_FOREGROUND} />
          </Pressable>
        )}
      </View>

      <FlatList
        horizontal
        data={movies}
        renderItem={renderMovie}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        initialNumToRender={4}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
};

export const MovieSection = memo(MovieSectionComponent);

const styles = StyleSheet.create({
  container: {
    marginBottom: ESpacing.XXL,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESpacing.MD,
    paddingHorizontal: ESpacing.LG,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
  },
  icon: {
    fontSize: EFontSize.LG,
  },
  title: {
    fontSize: EFontSize.LG,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
  },
  scrollContent: {
    paddingHorizontal: ESpacing.LG,
    gap: ESpacing.MD,
  },
});
