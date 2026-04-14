'use client';

import { useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('access_token');
    
    if (token) {
      signIn('credentials', {
        token,
        redirect: false,
      }).then((res) => {
        if (res?.ok) {
          router.push('/');
        } else {
          console.error('Login failed', res);
          router.push('/signin?error=GoogleAuthFailed');
        }
      });
    } else {
      router.push('/signin?error=NoToken');
    }
  }, [searchParams, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
