import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { TContent } from '../../../../domain/content';
import { EColors, ESpacing, EFontSize, EFontWeight, EBorderRadius } from '../../../../ui/tokens';
import { useI18n } from '../../../../core/i18n';

export type TContentCardProps = {
  content: TContent;
  onPress: (contentId: string) => void;
  showLock?: boolean;
};

export const ContentCard: React.FC<TContentCardProps> = ({ content, onPress, showLock = false }) => {
  const { t } = useI18n();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(content.id)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: content.coverImage }} style={styles.image} />
        {showLock && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockText}>{t('content.premiumLabel')}</Text>
          </View>
        )}
        {content.rating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {content.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {content.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {content.description}
        </Text>
        <View style={styles.genresContainer}>
          {content.genres.slice(0, 2).map((genre, index) => (
            <View key={index} style={styles.genreBadge}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.LG,
    overflow: 'hidden',
    width: 180,
  },
  cardPressed: {
    opacity: 0.8,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESpacing.SM,
  },
  lockIcon: {
    fontSize: 40,
  },
  lockText: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  ratingBadge: {
    position: 'absolute',
    top: ESpacing.SM,
    right: ESpacing.SM,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: EBorderRadius.SM,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: EFontSize.XS,
    color: EColors.FOREGROUND,
    fontWeight: EFontWeight.MEDIUM,
  },
  content: {
    padding: ESpacing.MD,
    gap: ESpacing.SM,
  },
  title: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  description: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    lineHeight: EFontSize.SM * 1.4,
  },
  genresContainer: {
    flexDirection: 'row',
    gap: ESpacing.SM,
    marginTop: ESpacing.XS,
  },
  genreBadge: {
    backgroundColor: EColors.PRIMARY + '20',
    borderRadius: EBorderRadius.SM,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 2,
  },
  genreText: {
    fontSize: EFontSize.XS,
    color: EColors.PRIMARY,
    fontWeight: EFontWeight.MEDIUM,
  },
});
