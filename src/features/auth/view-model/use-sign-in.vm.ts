import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../core/auth';
import { useI18n } from '../../../core/i18n';

type TSignInViewModelOptions = {
  redirectTo?: string;
};

type TSignInViewModel = {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  submit: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export const useSignInViewModel = (options?: TSignInViewModelOptions): TSignInViewModel => {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async () => {
    if (!email || !password) {
      setError(t('auth.error'));
      return;
    }
    try {
      setError(null);
      await signIn(email, password);
      if (options?.redirectTo) {
        router.replace(options.redirectTo as `/${string}`);
      }
    } catch {
      setError(t('auth.error'));
    }
  }, [email, password, signIn, t, options?.redirectTo, router]);

  return {
    email,
    password,
    setEmail,
    setPassword,
    submit,
    isLoading,
    error,
  };
};
