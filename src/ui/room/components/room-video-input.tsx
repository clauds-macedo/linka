import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button, EButtonVariant, EButtonSize } from '../../components/button';
import { EBorderRadius, EColors, EFontSize, ESpacing } from '../../tokens';
import { useI18n } from '../../../core/i18n';

type TRoomVideoInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export const RoomVideoInput: React.FC<TRoomVideoInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
}) => {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={t('room.videoInput.placeholder')}
        placeholderTextColor={EColors.MUTED_FOREGROUND}
        editable={!disabled}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button.Root
        variant={EButtonVariant.OUTLINE}
        size={EButtonSize.SM}
        onPress={onSubmit}
        disabled={disabled}
      >
        <Button.Text>{t('room.videoInput.button')}</Button.Text>
      </Button.Root>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: ESpacing.SM,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    borderRadius: EBorderRadius.MD,
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    color: EColors.FOREGROUND,
    fontSize: EFontSize.SM,
    backgroundColor: EColors.CARD,
  },
});
