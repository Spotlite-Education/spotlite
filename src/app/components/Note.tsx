import styles from './Note.module.scss';

const Note = ({ children }: { children: React.ReactNode }) => {
  return <span className={styles.note}>{children}</span>;
};

export default Note;
