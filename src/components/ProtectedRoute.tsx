'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('ProtectedRoute: Checking auth...');
        const supabase = createClientComponentClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        console.log('ProtectedRoute auth check:', {
          userId: user?.id || 'NO USER',
          error: error?.message || 'NO ERROR'
        });

        if (!user) {
          console.log('ProtectedRoute: No user found, redirecting to login');
          router.replace('/login');
        } else {
          console.log('ProtectedRoute: User authenticated');
        }
      } catch (error) {
        console.error('ProtectedRoute auth error:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
} 