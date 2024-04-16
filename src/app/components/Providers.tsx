'use client';

import socket from '@/context/socket';
import { Theme } from '@radix-ui/themes';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { useEffect } from 'react';

interface ProviderProps {
  children?: React.ReactNode;
}

type StatusResponse =
  | {
      valid: true;
      session: {
        roomCode: string;
        isAdmin: boolean;
      };
    }
  | {
      valid: false;
    };

export const Providers = ({ children }: ProviderProps) => {
  const router = useRouter();

  const layoutSegment = useSelectedLayoutSegment();

  useEffect(() => {
    const handleReconnect = () => {
      const sessionToken = sessionStorage.getItem('sessionToken');
      if (!sessionToken) {
        router.replace(
          layoutSegment === 'admin' || layoutSegment === 'host' ? '/host' : '/'
        );
        return;
      }

      socket.emit('reconnect', sessionToken, (status: StatusResponse) => {
        if (status.valid) {
          const { roomCode, isAdmin } = status.session;
          router.replace(isAdmin ? `/admin/${roomCode}` : `/${roomCode}`);
        } else {
          sessionStorage.setItem('sessionToken', '');
          router.replace(
            layoutSegment === 'admin' || layoutSegment === 'host'
              ? '/host'
              : '/'
          );
        }
      });
    };

    handleReconnect();

    window.addEventListener('storage', handleReconnect);
    socket.on('forceReconnect', handleReconnect);

    return () => {
      window.removeEventListener('storage', handleReconnect);
      socket.off('forceReconnect', handleReconnect);
    };
  }, []);

  return <Theme>{children}</Theme>;
};
