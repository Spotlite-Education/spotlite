'use client';
import { GameStateContext } from '@/context/GameStateContext';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import styles from '../layout.module.scss';
import { UnstyledLink } from '@/app/components/UnstyledLink';

const EnsureTeacher = ({ children }: { children: React.ReactNode }) => {
  const gameState = useContext(GameStateContext);
  const router = useRouter();

  if (!gameState) {
    return null;
  }

  if (!gameState.isAdmin) {
    return (
      <div className={styles.noAccessPage}>
        <span className={styles.message}>
          You don&apos;t have access to this page.
        </span>
        <UnstyledLink href="/play/student">
          <div className={styles.redirectButton}>Go Back</div>
        </UnstyledLink>
      </div>
    );
  }

  return children;
};

export default EnsureTeacher;
