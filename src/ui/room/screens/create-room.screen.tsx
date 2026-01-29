import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../core/auth';
import { useI18n } from '../../../core/i18n';
import { useCreateRoomViewModel } from '../../../domain/room/view-models/use-create-room.vm';
import { RoomRoot } from '../components/room-root';
import { RoomVideoInput } from '../components/room-video-input';
import { Button, EButtonVariant, EButtonSize } from '../../components/button';
import { EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TCreateRoomScreenProps = {
  onCreated?: (roomId: string) => void;
};

export const CreateRoomScreen: React.FC<TCreateRoomScreenProps> = ({ onCreated }) => {
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const viewModel = useCreateRoomViewModel(userId);

  const handleCreate = async () => {
    const roomId = await viewModel.createRoom();
    if (!roomId) return;
    if (onCreated) {
      onCreated(roomId);
      return;
    }
    router.push(`/room/${roomId}`);
  };

  if (!userId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RoomRoot>
          <Text style={styles.message}>{t('createRoom.authRequired')}</Text>
        </RoomRoot>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RoomRoot>
          <Text style={styles.title}>{t('createRoom.title')}</Text>
          <Text style={styles.subtitle}>{t('createRoom.subtitle')}</Text>
          <RoomVideoInput
            value={viewModel.videoIdInput}
            onChange={viewModel.setVideoIdInput}
            onSubmit={handleCreate}
            disabled={viewModel.isLoading}
          />
          <Button.Root
            variant={EButtonVariant.HERO}
            size={EButtonSize.DEFAULT}
            onPress={handleCreate}
            disabled={viewModel.isLoading}
          >
            <Button.Text>
              {viewModel.isLoading ? t('createRoom.loading') : t('createRoom.create')}
            </Button.Text>
          </Button.Root>
          {viewModel.error ? <Text style={styles.error}>{t('createRoom.error')}</Text> : null}
        </RoomRoot>
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
  },
  title: {
    fontSize: EFontSize.XXL,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  subtitle: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    marginBottom: ESpacing.MD,
  },
  message: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.MEDIUM,
    color: EColors.MUTED_FOREGROUND,
  },
  error: {
    fontSize: EFontSize.SM,
    color: EColors.DESTRUCTIVE,
    marginTop: ESpacing.SM,
  },
});
