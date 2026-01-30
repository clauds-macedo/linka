import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TTwitchBrowserProps = {
  onChannelSelect: (channelName: string) => void;
  onBack: () => void;
};

const TWITCH_URL = 'https://m.twitch.tv';

const extractChannelName = (url: string): string | null => {
  const patterns = [
    /twitch\.tv\/([a-zA-Z0-9_]{4,25})(?:\/|$|\?)/,
    /twitch\.tv\/videos\/(\d+)/,
  ];

  const excludedPaths = [
    'directory',
    'search',
    'settings',
    'downloads',
    'subscriptions',
    'inventory',
    'wallet',
    'drops',
    'prime',
    'turbo',
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      const result = match[1].toLowerCase();
      if (!excludedPaths.includes(result)) {
        return match[1];
      }
    }
  }
  return null;
};

export const TwitchBrowser: React.FC<TTwitchBrowserProps> = ({ onChannelSelect, onBack }) => {
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      const channelName = extractChannelName(navState.url);
      if (channelName) {
        onChannelSelect(channelName);
      }
    },
    [onChannelSelect]
  );

  const handleShouldStartLoad = useCallback(
    (event: { url: string }): boolean => {
      const channelName = extractChannelName(event.url);
      if (channelName) {
        onChannelSelect(channelName);
        return false;
      }
      return true;
    },
    [onChannelSelect]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Selecione um canal</Text>
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: TWITCH_URL }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        allowsInlineMediaPlayback={false}
        mediaPlaybackRequiresUserAction
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        userAgent="Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    backgroundColor: EColors.CARD,
    borderBottomWidth: 1,
    borderBottomColor: EColors.BORDER,
    gap: ESpacing.MD,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ESpacing.XS,
    paddingHorizontal: ESpacing.SM,
    backgroundColor: EColors.SECONDARY,
    borderRadius: EBorderRadius.SM,
    gap: ESpacing.XS,
  },
  backIcon: {
    fontSize: EFontSize.BASE,
    color: EColors.FOREGROUND,
  },
  backText: {
    fontSize: EFontSize.SM,
    color: EColors.FOREGROUND,
    fontWeight: EFontWeight.MEDIUM,
  },
  title: {
    flex: 1,
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.MEDIUM,
    color: EColors.MUTED_FOREGROUND,
  },
  webview: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
});
