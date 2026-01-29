import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface ICardProps {
  children: ReactNode;
  style?: ViewStyle;
  blurIntensity?: number;
}
