import { TContent, TContentListResponse, EContentTier, EContentType, EContentStatus } from '../../domain/content';
import { ESubscriptionPlan } from '../../domain/user';

const mockPremiumContent: TContent[] = [
  {
    id: '1',
    title: 'Succession (Premium)',
    description: 'Série exclusiva para assinantes Premium',
    coverImage: 'https://picsum.photos/400/600',
    type: EContentType.SERIES,
    tier: EContentTier.PREMIUM,
    status: EContentStatus.AVAILABLE,
    releaseDate: '2023-01-01',
    rating: 9.2,
    genres: ['Drama', 'Business'],
    isPremium: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '2',
    title: 'The Last of Us (Premium Plus)',
    description: 'Conteúdo exclusivo Premium Plus',
    coverImage: 'https://picsum.photos/401/600',
    type: EContentType.SERIES,
    tier: EContentTier.PREMIUM_PLUS,
    status: EContentStatus.AVAILABLE,
    releaseDate: '2023-01-15',
    rating: 9.5,
    genres: ['Drama', 'Sci-Fi'],
    isPremium: true,
    createdAt: '2023-01-15',
    updatedAt: '2023-01-15',
  },
  {
    id: '3',
    title: 'Documentário Natureza',
    description: 'Disponível para todos',
    coverImage: 'https://picsum.photos/402/600',
    type: EContentType.DOCUMENTARY,
    tier: EContentTier.FREE,
    status: EContentStatus.AVAILABLE,
    releaseDate: '2023-02-01',
    rating: 8.7,
    genres: ['Documentário', 'Natureza'],
    isPremium: false,
    createdAt: '2023-02-01',
    updatedAt: '2023-02-01',
  },
];

export class PremiumContentService {
  static async getPremiumContent(
    subscriptionPlan: ESubscriptionPlan = ESubscriptionPlan.FREE
  ): Promise<TContentListResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredContent = mockPremiumContent;

    if (subscriptionPlan === ESubscriptionPlan.FREE) {
      filteredContent = mockPremiumContent.filter(
        (content) => content.tier === EContentTier.FREE
      );
    } else if (subscriptionPlan === ESubscriptionPlan.PREMIUM) {
      filteredContent = mockPremiumContent.filter(
        (content) =>
          content.tier === EContentTier.FREE || content.tier === EContentTier.PREMIUM
      );
    }

    return {
      content: filteredContent,
      total: filteredContent.length,
      page: 1,
    };
  }

  static async getContentById(id: string): Promise<TContent | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPremiumContent.find((content) => content.id === id) || null;
  }

  static canAccessContent(
    content: TContent,
    subscriptionPlan: ESubscriptionPlan
  ): boolean {
    if (content.tier === EContentTier.FREE) return true;

    if (
      content.tier === EContentTier.PREMIUM &&
      (subscriptionPlan === ESubscriptionPlan.PREMIUM ||
        subscriptionPlan === ESubscriptionPlan.PREMIUM_PLUS)
    ) {
      return true;
    }

    if (
      content.tier === EContentTier.PREMIUM_PLUS &&
      subscriptionPlan === ESubscriptionPlan.PREMIUM_PLUS
    ) {
      return true;
    }

    return false;
  }
}
