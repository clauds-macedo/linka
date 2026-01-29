import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../components/card';
import { EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TRoomParticipantsProps = {
  participants: string[];
};

enum ERoomParticipantsLabel {
  TITLE = 'Participantes',
}

export const RoomParticipants: React.FC<TRoomParticipantsProps> = ({ participants }) => {
  return (
    <Card>
      <View style={styles.container}>
        <Text style={styles.title}>{ERoomParticipantsLabel.TITLE}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{participants.length}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: EFontSize.MD,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  countBadge: {
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.XS,
    borderRadius: 999,
    backgroundColor: EColors.PRIMARY,
  },
  countText: {
    color: EColors.FOREGROUND,
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
  },
});
