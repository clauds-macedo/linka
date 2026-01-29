import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TYouTubeBrowserProps = {
  onVideoSelect: (videoId: string) => void;
  onBack: () => void;
};

const YOUTUBE_URL = 'https://m.youtube.com';

const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
};

export const YouTubeBrowser: React.FC<TYouTubeBrowserProps> = ({ onVideoSelect, onBack }) => {
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      const videoId = extractVideoId(navState.url);
      if (videoId) {
        onVideoSelect(videoId);
      }
    },
    [onVideoSelect]
  );

  const handleShouldStartLoad = useCallback(
    (event: { url: string }): boolean => {
      const videoId = extractVideoId(event.url);
      if (videoId) {
        onVideoSelect(videoId);
        return false;
      }
      return true;
    },
    [onVideoSelect]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Selecione um vídeo</Text>
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: YOUTUBE_URL }}
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
