'use client';
import Header from '@/app/components/Header';
import styles from './page.module.scss';
import Input, { IconInput } from '@/app/components/Input';
import { useState } from 'react';
import Button from '@/app/components/Button';
import { FaTimes } from 'react-icons/fa';
import Note from '@/app/components/Note';

const ChooseTopics = () => {
  const [topics, setTopics] = useState<string[]>([]);

  const handleAddTopic = () => {
    setTopics(prev => [...prev, '']);
  };

  const handleEditTopic = (index: number, value: string) => {
    const copy = topics.slice();
    copy[index] = value;
    setTopics(copy);
  };

  const handleDeleteTopic = (index: number) => {
    const copy = topics.slice();
    copy.splice(index, 1);
    setTopics(copy);
  };

  const DeleteTopic = ({ index }: { index: number }) => (
    <button
      className={styles.deleteTopic}
      onClick={() => handleDeleteTopic(index)}
    >
      <FaTimes size="2rem" color="var(--input-placeholder-color)" />
    </button>
  );

  return (
    <div className={styles.chooseTopics}>
      <Header>WHAT TOPICS SHOULD STUDENTS COVER?</Header>
      <div className={styles.topics}>
        {topics.length === 0 ? <Note>There's nothing here...</Note> : null}
        {topics.map((topic, i) => (
          <IconInput
            className={styles.topic}
            placeholder="Some topic..."
            value={topic}
            onChange={e => handleEditTopic(i, e.target.value)}
            right={<DeleteTopic index={i} />}
          />
        ))}
      </div>
      <button
        className={styles.addTopic}
        disabled={topics.length >= 4}
        onClick={handleAddTopic}
      >
        +
      </button>
      <Button className={styles.hostRoom} fill="secondary">
        Host Room
      </Button>
    </div>
  );
};

interface LobbyProps {
  roomCode: string;
}

const Lobby = ({ roomCode }: LobbyProps) => {
  return (
    <div className={styles.lobby}>
      <div className={styles.roomSettings}>
        <div className={styles.roomCodeDetails}>
          <div className={styles.yourRoomCodeIs}>Your room code is</div>
          <div className={styles.roomCode}>{roomCode}</div>
        </div>
        <div className={styles.settings}></div>
      </div>
    </div>
  );
};

const AdminPage = ({ params }: { params: { roomCode: string } }) => {
  return (
    <main className={styles.main}>
      <Lobby roomCode={params.roomCode} />
      {/* <ChooseTopics /> */}
    </main>
  );
};

export default AdminPage;
