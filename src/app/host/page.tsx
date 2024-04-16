'use client';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { SOCKET_URL } from '../../context/socket';
import socket from '../../context/socket';
import { Logo } from '../components/Logo';
import { UnstyledLink } from '../components/UnstyledLink';
import { MouseEvent } from 'react';

const HostRoom = () => {
  const router = useRouter();

  const handleCreateRoom = (e: MouseEvent<HTMLButtonElement>) => {
    fetch(SOCKET_URL + '/createRoom', { method: 'POST' })
      .then(response => {
        return response.json();
      })
      .then(data => {
        sessionStorage.setItem('sessionToken', data.admin.id);
        socket.emit('join', 'admin', data.room.code, data.admin.id);
        router.push('/admin/' + data.room.code);
      });
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.corner} />
        <UnstyledLink href="/">
          <div className={styles.studentMode}>Student Mode!</div>
        </UnstyledLink>

        <Logo size="xl" />
        <div className={styles.forTeachers}>For Teachers</div>
        <button className={styles.hostGame} onClick={handleCreateRoom}>
          Create Game!
        </button>
      </div>
      <div className={styles.footer}>
        <div className={styles.legal}>
          <UnstyledLink href="/">Terms & Conditions</UnstyledLink>
          <UnstyledLink href="/">Privacy Policy</UnstyledLink>
        </div>
        <div className={styles.center}>
          <UnstyledLink href="/">
            See what other creative minds have made at spotlite.org
          </UnstyledLink>
        </div>
        <div className={styles.copyright}>Copyright © 2024 Spotlite</div>
      </div>
    </main>
  );
};

export default HostRoom;
