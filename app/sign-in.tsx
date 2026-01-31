import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SignInView } from '../src/features/auth/view/sign-in.view';

export default function SignInRoute() {
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  return <SignInView redirectTo={redirect} />;
}
