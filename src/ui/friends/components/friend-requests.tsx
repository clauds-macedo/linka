import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { UserCircle, Check, X } from 'lucide-react-native';
import { TFriendRequest } from '../../../domain/friends/types';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TFriendRequestsProps = {
  requests: TFriendRequest[];
  onAccept: (request: TFriendRequest) => void;
  onReject: (request: TFriendRequest) => void;
};

type TRequestItemProps = {
  request: TFriendRequest;
  onAccept: () => void;
  onReject: () => void;
};

const RequestItem: React.FC<TRequestItemProps> = ({ request, onAccept, onReject }) => {
  const timeAgo = useCallback((timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'agora';
  }, []);

  return (
    <View style={styles.requestItem}>
      <View style={styles.avatarContainer}>
        {request.fromUserAvatar ? (
          <Image source={{ uri: request.fromUserAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <UserCircle size={32} color={EColors.MUTED_FOREGROUND} />
          </View>
        )}
      </View>

      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>{request.fromUserName}</Text>
        <Text style={styles.requestTime}>Solicitou há {timeAgo(request.createdAt)}</Text>
      </View>

      <View style={styles.requestActions}>
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Check size={18} color={EColors.FOREGROUND} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <X size={18} color={EColors.FOREGROUND} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const FriendRequests: React.FC<TFriendRequestsProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  const renderRequest = useCallback(
    ({ item }: { item: TFriendRequest }) => (
      <RequestItem
        request={item}
        onAccept={() => onAccept(item)}
        onReject={() => onReject(item)}
      />
    ),
    [onAccept, onReject]
  );

  const keyExtractor = useCallback((item: TFriendRequest) => item.id, []);

  if (requests.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitações de amizade ({requests.length})</Text>
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: ESpacing.MD,
  },
  title: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.MUTED_FOREGROUND,
    marginBottom: ESpacing.SM,
  },
  listContent: {
    gap: ESpacing.SM,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.LG,
    padding: ESpacing.MD,
    borderWidth: 1,
    borderColor: EColors.PRIMARY,
    gap: ESpacing.MD,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: EColors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  requestTime: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  requestActions: {
    flexDirection: 'row',
    gap: ESpacing.XS,
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4ade80',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: EColors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
