import { ESubscriptionPlan, ESubscriptionStatus, EUserRole } from './enums';

export type TSubscription = {
  plan: ESubscriptionPlan;
  status: ESubscriptionStatus;
  expiresAt: string | null;
  startedAt: string;
};

export type TUser = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: EUserRole;
  subscription: TSubscription;
  createdAt: string;
};

export type TAuthState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
