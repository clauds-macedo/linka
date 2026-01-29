import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useI18n } from '../../../core/i18n';
import { Button, EButtonSize, EButtonVariant } from '../../../ui/components/button';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../../ui/tokens';
import { useSignInViewModel } from '../view-model/use-sign-in.vm';

type TSignInViewProps = {
  onSignUp?: () => void;
};

export const SignInView: React.FC<TSignInViewProps> = ({ onSignUp }) => {
  const router = useRouter();
  const { t } = useI18n();
  const viewModel = useSignInViewModel();

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
      return;
    }
    router.push('/sign-up');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.signIn')}</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={viewModel.email}
            onChangeText={viewModel.setEmail}
            placeholder={t('auth.email')}
            placeholderTextColor={EColors.MUTED_FOREGROUND}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            value={viewModel.password}
            onChangeText={viewModel.setPassword}
            placeholder={t('auth.password')}
            placeholderTextColor={EColors.MUTED_FOREGROUND}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button.Root
            variant={EButtonVariant.HERO}
            size={EButtonSize.DEFAULT}
            onPress={viewModel.submit}
            disabled={viewModel.isLoading}
          >
            <Button.Text>
              {viewModel.isLoading ? t('auth.loading') : t('auth.signIn')}
            </Button.Text>
          </Button.Root>
          {viewModel.error ? <Text style={styles.error}>{viewModel.error}</Text> : null}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.noAccount')}</Text>
          <Button.Root
            variant={EButtonVariant.GHOST}
            size={EButtonSize.SM}
            onPress={handleSignUp}
          >
            <Button.Text>{t('auth.signUp')}</Button.Text>
          </Button.Root>
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
  content: {
    padding: ESpacing.LG,
    gap: ESpacing.XL,
  },
  header: {
    gap: ESpacing.SM,
  },
  title: {
    fontSize: EFontSize.XXL,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  form: {
    gap: ESpacing.MD,
  },
  input: {
    borderWidth: 1,
    borderColor: EColors.BORDER,
    borderRadius: EBorderRadius.MD,
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    color: EColors.FOREGROUND,
    fontSize: EFontSize.SM,
    backgroundColor: EColors.CARD,
  },
  error: {
    color: EColors.DESTRUCTIVE,
    fontSize: EFontSize.SM,
  },
  footer: {
    gap: ESpacing.SM,
    alignItems: 'center',
  },
  footerText: {
    color: EColors.MUTED_FOREGROUND,
    fontSize: EFontSize.SM,
  },
});
