import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { EBorderRadius, EColors } from '../../tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLAYER_WIDTH = SCREEN_WIDTH - 32;
const PLAYER_HEIGHT = (PLAYER_WIDTH * 9) / 16;

export type TTwitchPlayerProps = {
  channelName: string;
  isPlaying: boolean;
  onStateChange?: (state: string) => void;
};

export const TwitchPlayer: React.FC<TTwitchPlayerProps> = ({
  channelName,
  isPlaying,
}) => {
  const embedUrl = `https://player.twitch.tv/?channel=${channelName}&parent=localhost&muted=false&autoplay=${isPlaying}`;

  const injectedJS = `
    (function() {
      const style = document.createElement('style');
      style.textContent = 'body { margin: 0; padding: 0; overflow: hidden; background: #0d0e14; }';
      document.head.appendChild(style);
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: embedUrl }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        injectedJavaScript={injectedJS}
        scrollEnabled={false}
        bounces={false}
        webViewProps={{
          androidLayerType: 'hardware',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    borderRadius: EBorderRadius.XL,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: EColors.BORDER,
    backgroundColor: EColors.CARD,
    alignSelf: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
});
