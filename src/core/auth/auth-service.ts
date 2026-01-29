import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ESubscriptionPlan, ESubscriptionStatus, EUserRole, TUser } from '../../domain/user';

type TAuthListener = (user: TUser | null) => void;

type TAuthCredentials = {
  email: string;
  password: string;
};

const mapUser = (user: FirebaseAuthTypes.User): TUser => {
  const now = new Date().toISOString();
  const createdAt = user.metadata.creationTime ?? now;
  const startedAt = createdAt;
  const name = user.displayName ?? user.email ?? 'User';

  return {
    id: user.uid,
    email: user.email ?? '',
    name,
    avatar: user.photoURL ?? null,
    role: EUserRole.USER,
    subscription: {
      plan: ESubscriptionPlan.FREE,
      status: ESubscriptionStatus.ACTIVE,
      expiresAt: null,
      startedAt,
    },
    createdAt,
  };
};

export class AuthService {
  static subscribe(listener: TAuthListener) {
    return auth().onAuthStateChanged((user) => {
      listener(user ? mapUser(user) : null);
    });
  }

  static async signIn({ email, password }: TAuthCredentials): Promise<TUser> {
    const result = await auth().signInWithEmailAndPassword(email, password);
    return mapUser(result.user);
  }

  static async signUp({ email, password }: TAuthCredentials): Promise<TUser> {
    const result = await auth().createUserWithEmailAndPassword(email, password);
    return mapUser(result.user);
  }

  static async signOut(): Promise<void> {
    await auth().signOut();
  }
}
