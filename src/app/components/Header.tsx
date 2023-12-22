import styles from './Header.module.scss';

const Header = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.header}>{children}</div>;
};

export default Header;
