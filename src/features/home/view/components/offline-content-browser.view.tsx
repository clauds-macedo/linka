import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { TOfflineContent, TContentCategory, TEpisode } from '../../../domain/content/types';
import { CategorySelector } from './category-selector.view';
import { ContentList } from './content-list.view';
import { EpisodeSelector } from '../../../ui/offline-player/episode-selector.view';
import { OfflinePlayerScreen } from '../../../ui/offline-player/offline-player.screen';
import { OfflineContentService } from '../../../domain/content/services/offline-content.service';
import { EColors } from '../../../ui/tokens';

export const OfflineContentBrowser: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<TContentCategory | null>(null);
  const [selectedContent, setSelectedContent] = useState<TOfflineContent | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<TEpisode | null>(null);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);

  const handleSelectContent = (content: TOfflineContent) => {
    setSelectedContent(content);

    if (content.type === 'movie') {
      const episode = OfflineContentService.getFirstEpisode(content);
      if (episode) {
        setSelectedEpisode(episode);
      }
    } else {
      setShowEpisodeSelector(true);
    }
  };

  const handleSelectEpisode = (episode: TEpisode) => {
    setSelectedEpisode(episode);
    setShowEpisodeSelector(false);
  };

  const handleClosePlayer = () => {
    setSelectedEpisode(null);
    setSelectedContent(null);
  };

  const handleCloseEpisodeSelector = () => {
    setShowEpisodeSelector(false);
    setSelectedContent(null);
  };

  return (
    <>
      <View style={styles.container}>
        <CategorySelector
          onSelectCategory={setSelectedCategory}
          selectedId={selectedCategory?.id}
        />

        {selectedCategory && (
          <ContentList
            category={selectedCategory}
            onSelectContent={handleSelectContent}
          />
        )}
      </View>

      <Modal
        visible={showEpisodeSelector && selectedContent !== null}
        animationType="slide"
        onRequestClose={handleCloseEpisodeSelector}
      >
        {selectedContent && (
          <EpisodeSelector
            content={selectedContent}
            onSelectEpisode={handleSelectEpisode}
            onClose={handleCloseEpisodeSelector}
          />
        )}
      </Modal>

      <Modal
        visible={selectedEpisode !== null}
        animationType="slide"
        onRequestClose={handleClosePlayer}
      >
        {selectedContent && selectedEpisode && (
          <OfflinePlayerScreen
            content={selectedContent}
            episode={selectedEpisode}
          />
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: EColors.BACKGROUND,
  },
});
