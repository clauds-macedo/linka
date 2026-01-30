import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { TMovie } from '../../../../domain/movie';
import { EColors, ESpacing, EFontSize, EFontWeight, EBorderRadius } from '../../../../ui/tokens';

export type TMovieCardProps = {
  movie: TMovie;
  onPress: (movie: TMovie) => void;
  size?: 'default' | 'large';
};

export const MovieCard: React.FC<TMovieCardProps> = ({ movie, onPress, size = 'default' }) => {
  const isLarge = size === 'large';
  const cardWidth = isLarge ? 200 : 140;
  const imageHeight = isLarge ? 280 : 200;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth },
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(movie)}
    >
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image
          source={{ uri: movie.tmdb?.poster }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        {movie.tmdb?.rating > 0 && (
          <View style={styles.ratingBadge}>
            <Star size={10} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{movie.tmdb.rating.toFixed(1)}</Text>
          </View>
        )}
        {movie.type === 'series' && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>Série</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.tmdb?.title ?? movie.name}
        </Text>
        {movie.tmdb?.year && (
          <Text style={styles.year}>{movie.tmdb.year}</Text>
        )}
        {movie.tmdb?.genres && movie.tmdb.genres.length > 0 && (
          <View style={styles.genresContainer}>
            {movie.tmdb.genres.slice(0, 2).map((genre, index) => (
              <View key={index} style={styles.genreBadge}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.LG,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  ratingBadge: {
    position: 'absolute',
    top: ESpacing.SM,
    right: ESpacing.SM,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: EBorderRadius.SM,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: EFontSize.XS,
    color: EColors.FOREGROUND,
    fontWeight: EFontWeight.SEMIBOLD,
  },
  typeBadge: {
    position: 'absolute',
    top: ESpacing.SM,
    left: ESpacing.SM,
    backgroundColor: EColors.PRIMARY,
    borderRadius: EBorderRadius.SM,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 10,
    color: EColors.FOREGROUND,
    fontWeight: EFontWeight.SEMIBOLD,
  },
  content: {
    padding: ESpacing.SM,
    gap: 4,
  },
  title: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
    lineHeight: EFontSize.SM * 1.3,
  },
  year: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  genresContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  genreBadge: {
    backgroundColor: EColors.PRIMARY + '20',
    borderRadius: EBorderRadius.SM,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  genreText: {
    fontSize: 10,
    color: EColors.PRIMARY,
    fontWeight: EFontWeight.MEDIUM,
  },
});
