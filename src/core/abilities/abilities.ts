import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { TUser, ESubscriptionPlan, EUserRole } from '../../domain/user';
import { TContent, EContentTier } from '../../domain/content';
import { TRoom } from '../../domain/room';

export enum EAction {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  JOIN = 'join',
  MANAGE = 'manage',
}

export enum ESubject {
  CONTENT = 'Content',
  ROOM = 'Room',
  ALL = 'all',
}

export type TActions = EAction;
export type TSubjects = TContent | TRoom | ESubject;

export type TAppAbility = MongoAbility<[TActions, TSubjects]>;

export const defineAbilitiesFor = (user: TUser | null): TAppAbility => {
  const { can, cannot, build } = new AbilityBuilder<TAppAbility>(createMongoAbility);

  if (!user) {
    can(EAction.VIEW, ESubject.CONTENT, { isPremium: false });
    can(EAction.VIEW, ESubject.ROOM);
    cannot(EAction.CREATE, ESubject.ROOM);
    cannot(EAction.JOIN, ESubject.ROOM);
  } else {
    can(EAction.VIEW, ESubject.CONTENT, { isPremium: false });
    can(EAction.VIEW, ESubject.ROOM);
    can(EAction.CREATE, ESubject.ROOM);
    can(EAction.JOIN, ESubject.ROOM);

    if (
      user.subscription.plan === ESubscriptionPlan.PREMIUM ||
      user.subscription.plan === ESubscriptionPlan.PREMIUM_PLUS
    ) {
      can(EAction.VIEW, ESubject.CONTENT, { tier: EContentTier.PREMIUM });
    }

    if (user.subscription.plan === ESubscriptionPlan.PREMIUM_PLUS) {
      can(EAction.VIEW, ESubject.CONTENT, { tier: EContentTier.PREMIUM_PLUS });
    }

    if (user.role === EUserRole.ADMIN) {
      can(EAction.MANAGE, ESubject.ALL);
    }
  }

  return build();
};
