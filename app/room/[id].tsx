import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, EButtonVariant, EButtonSize } from '../../src/ui/components/button';
import { EColors, ESpacing, EFontSize, EFontWeight } from '../../src/ui/tokens';

export default function RoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Sala #{id}</Text>
        <Text style={styles.subtitle}>Em desenvolvimento...</Text>
        <Button.Root
          variant={EButtonVariant.OUTLINE}
          size={EButtonSize.DEFAULT}
          onPress={handleGoBack}
        >
          <Button.Text>Voltar</Button.Text>
        </Button.Root>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ESpacing.XL,
    gap: ESpacing.LG,
  },
  title: {
    fontSize: EFontSize.XXL,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  subtitle: {
    fontSize: EFontSize.BASE,
    color: EColors.MUTED_FOREGROUND,
  },
});
