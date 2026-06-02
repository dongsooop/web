'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

type GoogleProviderProps = {
  clientId: string;
  children: React.ReactNode;
};

export default function GoogleProvider({ clientId, children }: GoogleProviderProps) {
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
