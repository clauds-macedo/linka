import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Users, X, Crown, User } from 'lucide-react-native';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TParticipant = {
  id: string;
  isHost: boolean;
};

type TParticipantsListProps = {
  participants: string[];
  hostId: string;
  currentUserId: string;
};

const getAvatarColor = (id: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1',
  ];
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const getInitials = (id: string): string => {
  return id.substring(0, 2).toUpperCase();
};

export const ParticipantsList: React.FC<TParticipantsListProps> = ({
  participants,
  hostId,
  currentUserId,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const participantsList: TParticipant[] = participants.map((id) => ({
    id,
    isHost: id === hostId,
  }));

  const sortedParticipants = [...participantsList].sort((a, b) => {
    if (a.isHost) return -1;
    if (b.isHost) return 1;
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    return 0;
  });

  const displayCount = Math.min(3, participants.length);
  const extraCount = participants.length - displayCount;

  return (
    <>
      <TouchableOpacity 
        style={styles.avatarStack} 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        {sortedParticipants.slice(0, displayCount).map((participant, index) => (
          <View
            key={participant.id}
            style={[
              styles.stackedAvatar,
              { 
                backgroundColor: getAvatarColor(participant.id),
                zIndex: displayCount - index,
                marginLeft: index > 0 ? -10 : 0,
              },
            ]}
          >
            {participant.isHost ? (
              <Crown size={12} color="#FFF" />
            ) : (
              <Text style={styles.avatarText}>{getInitials(participant.id)}</Text>
            )}
          </View>
        ))}
        {extraCount > 0 && (
          <View style={[styles.stackedAvatar, styles.extraAvatar, { marginLeft: -10 }]}>
            <Text style={styles.extraText}>+{extraCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Users size={20} color={EColors.PRIMARY} />
                <Text style={styles.modalTitle}>Na Sala</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={EColors.MUTED_FOREGROUND} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.participantCount}>
              {participants.length} {participants.length === 1 ? 'pessoa' : 'pessoas'}
            </Text>

            <ScrollView style={styles.participantsList} showsVerticalScrollIndicator={false}>
              {sortedParticipants.map((participant) => (
                <View key={participant.id} style={styles.participantItem}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: getAvatarColor(participant.id) },
                    ]}
                  >
                    {participant.isHost ? (
                      <Crown size={16} color="#FFF" />
                    ) : (
                      <User size={16} color="#FFF" />
                    )}
                  </View>
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>
                      {participant.id === currentUserId ? 'Você' : `Usuário ${participant.id.slice(-4)}`}
                    </Text>
                    {participant.isHost && (
                      <View style={styles.hostBadge}>
                        <Text style={styles.hostBadgeText}>Host</Text>
                      </View>
                    )}
                  </View>
                  {participant.id === currentUserId && !participant.isHost && (
                    <View style={styles.youBadge}>
                      <Text style={styles.youBadgeText}>Você</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ESpacing.XS,
  },
  stackedAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: EColors.BACKGROUND,
  },
  avatarText: {
    fontSize: 10,
    fontWeight: EFontWeight.BOLD,
    color: '#FFF',
  },
  extraAvatar: {
    backgroundColor: EColors.MUTED,
  },
  extraText: {
    fontSize: 10,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ESpacing.LG,
  },
  modalContent: {
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.XL,
    width: '100%',
    maxWidth: 340,
    maxHeight: '70%',
    padding: ESpacing.LG,
    borderWidth: 1,
    borderColor: EColors.BORDER,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ESpacing.SM,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
  },
  modalTitle: {
    fontSize: EFontSize.LG,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  participantCount: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    marginBottom: ESpacing.MD,
  },
  participantsList: {
    maxHeight: 300,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ESpacing.SM,
    borderBottomWidth: 1,
    borderBottomColor: EColors.BORDER,
    gap: ESpacing.MD,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
  },
  participantName: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.MEDIUM,
    color: EColors.FOREGROUND,
  },
  hostBadge: {
    backgroundColor: EColors.PRIMARY,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 2,
    borderRadius: EBorderRadius.SM,
  },
  hostBadgeText: {
    fontSize: 10,
    fontWeight: EFontWeight.BOLD,
    color: EColors.PRIMARY_FOREGROUND,
  },
  youBadge: {
    backgroundColor: EColors.SECONDARY,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 2,
    borderRadius: EBorderRadius.SM,
  },
  youBadgeText: {
    fontSize: 10,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
});
