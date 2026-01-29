import { useCallback, useState } from 'react';
import { useAuth } from '../../../core/auth';
import { useI18n } from '../../../core/i18n';

type TSignInViewModel = {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  submit: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export const useSignInViewModel = (): TSignInViewModel => {
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
    } catch {
      setError(t('auth.error'));
    }
  }, [email, password, signIn, t]);

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
