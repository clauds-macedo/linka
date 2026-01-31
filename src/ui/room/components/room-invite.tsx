import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { X, Copy, Share2, Check } from 'lucide-react-native';
import { useShareRoom } from '../../../core/deep-link';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TRoomInviteProps = {
  visible: boolean;
  roomId: string;
  roomName?: string;
  onClose: () => void;
};

export const RoomInvite: React.FC<TRoomInviteProps> = ({
  visible,
  roomId,
  roomName,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);
  const { shareRoom, getRoomLinks } = useShareRoom();

  const links = useMemo(() => getRoomLinks(roomId), [getRoomLinks, roomId]);
  const inviteUrl = links.urls.web;

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inviteUrl]);

  const handleShare = useCallback(async () => {
    await shareRoom(roomId, roomName);
  }, [shareRoom, roomId, roomName]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Convidar para a sala</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={EColors.MUTED_FOREGROUND} />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={inviteUrl}
                size={180}
                backgroundColor={EColors.FOREGROUND}
                color={EColors.BACKGROUND}
              />
            </View>
            <Text style={styles.qrHint}>Escaneie o QR code para entrar</Text>
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.linkLabel}>Ou compartilhe o link:</Text>
            <View style={styles.linkBox}>
              <Text style={styles.linkText} numberOfLines={1}>{inviteUrl}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.copyButton]}
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              {copied ? (
                <Check size={18} color={EColors.FOREGROUND} />
              ) : (
                <Copy size={18} color={EColors.FOREGROUND} />
              )}
              <Text style={styles.actionButtonText}>
                {copied ? 'Copiado!' : 'Copiar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Share2 size={18} color={EColors.FOREGROUND} />
              <Text style={styles.actionButtonText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ESpacing.LG,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.XL,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    padding: ESpacing.LG,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESpacing.LG,
  },
  title: {
    fontSize: EFontSize.LG,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  closeButton: {
    padding: ESpacing.XS,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: ESpacing.LG,
  },
  qrWrapper: {
    padding: ESpacing.MD,
    backgroundColor: EColors.FOREGROUND,
    borderRadius: EBorderRadius.LG,
  },
  qrHint: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    marginTop: ESpacing.MD,
  },
  linkContainer: {
    marginBottom: ESpacing.LG,
  },
  linkLabel: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    marginBottom: ESpacing.XS,
  },
  linkBox: {
    backgroundColor: EColors.SECONDARY,
    borderRadius: EBorderRadius.MD,
    padding: ESpacing.MD,
    borderWidth: 1,
    borderColor: EColors.BORDER,
  },
  linkText: {
    fontSize: EFontSize.XS,
    color: EColors.FOREGROUND,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: ESpacing.SM,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESpacing.XS,
    paddingVertical: ESpacing.MD,
    borderRadius: EBorderRadius.MD,
  },
  copyButton: {
    backgroundColor: EColors.SECONDARY,
  },
  shareButton: {
    backgroundColor: EColors.PRIMARY,
  },
  actionButtonText: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
});
