import { EContentType, EContentTier, EContentStatus } from './enums';

export type TContent = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  type: EContentType;
  tier: EContentTier;
  status: EContentStatus;
  releaseDate: string;
  duration?: number;
  rating?: number;
  genres: string[];
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TContentListResponse = {
  content: TContent[];
  total: number;
  page: number;
};
