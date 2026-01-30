import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Youtube, Tv2, Film } from 'lucide-react-native';
import { EVideoSource } from '../../../domain/room/enums';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TSourceSelectorProps = {
  onSelect: (source: EVideoSource) => void;
};

type TSourceOption = {
  source: EVideoSource;
  label: string;
  description: string;
  color: string;
  icon: 'youtube' | 'twitch' | 'streaming';
};

const liveOptions: TSourceOption[] = [
  {
    source: EVideoSource.YOUTUBE,
    label: 'YouTube',
    description: 'Vídeos e lives',
    color: '#FF0000',
    icon: 'youtube',
  },
  {
    source: EVideoSource.TWITCH,
    label: 'Twitch',
    description: 'Lives de games',
    color: '#9146FF',
    icon: 'twitch',
  },
];

const streamingOptions: TSourceOption[] = [
  {
    source: EVideoSource.NETFLIX,
    label: 'Netflix',
    description: 'Filmes e séries',
    color: '#E50914',
    icon: 'streaming',
  },
  {
    source: EVideoSource.PRIME_VIDEO,
    label: 'Prime Video',
    description: 'Filmes e séries',
    color: '#00A8E1',
    icon: 'streaming',
  },
  {
    source: EVideoSource.DISNEY,
    label: 'Disney+',
    description: 'Filmes e séries',
    color: '#113CCF',
    icon: 'streaming',
  },
  {
    source: EVideoSource.MAX,
    label: 'Max',
    description: 'HBO e mais',
    color: '#002BE7',
    icon: 'streaming',
  },
  {
    source: EVideoSource.APPLE_TV,
    label: 'Apple TV+',
    description: 'Originais Apple',
    color: '#555555',
    icon: 'streaming',
  },
  {
    source: EVideoSource.PARAMOUNT,
    label: 'Paramount+',
    description: 'Filmes e séries',
    color: '#0064FF',
    icon: 'streaming',
  },
  {
    source: EVideoSource.GLOBOPLAY,
    label: 'Globoplay',
    description: 'Novelas e séries',
    color: '#F72B2B',
    icon: 'streaming',
  },
  {
    source: EVideoSource.CRUNCHYROLL,
    label: 'Crunchyroll',
    description: 'Animes',
    color: '#F47521',
    icon: 'streaming',
  },
];

const SourceIcon: React.FC<{ type: TSourceOption['icon'] }> = ({ type }) => {
  switch (type) {
    case 'youtube':
      return <Youtube size={28} color="#FFFFFF" />;
    case 'twitch':
      return <Tv2 size={28} color="#FFFFFF" />;
    default:
      return <Film size={28} color="#FFFFFF" />;
  }
};

export const SourceSelector: React.FC<TSourceSelectorProps> = ({ onSelect }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Ao vivo</Text>
      <View style={styles.container}>
        {liveOptions.map((option) => (
          <TouchableOpacity
            key={option.source}
            style={styles.option}
            onPress={() => onSelect(option.source)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
              <SourceIcon type={option.icon} />
            </View>
            <Text style={styles.label}>{option.label}</Text>
            <Text style={styles.description}>{option.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Streamings</Text>
      <View style={styles.container}>
        {streamingOptions.map((option) => (
          <TouchableOpacity
            key={option.source}
            style={styles.option}
            onPress={() => onSelect(option.source)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
              <SourceIcon type={option.icon} />
            </View>
            <Text style={styles.label}>{option.label}</Text>
            <Text style={styles.description}>{option.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: EFontSize.LG,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
    marginBottom: ESpacing.MD,
    marginTop: ESpacing.LG,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: ESpacing.MD,
  },
  option: {
    alignItems: 'center',
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.LG,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    padding: ESpacing.MD,
    width: 100,
    gap: ESpacing.XS,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: EBorderRadius.MD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
    textAlign: 'center',
  },
  description: {
    fontSize: 10,
    color: EColors.MUTED_FOREGROUND,
    textAlign: 'center',
  },
});
