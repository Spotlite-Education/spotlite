import styles from './Logo.module.scss';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'bordered';
}

export const Logo = ({ size, variant }: LogoProps) => {
  return (
    <div
      className={`${styles.wrapper} ${styles[size || 'md']} ${
        variant ? styles[variant] : undefined
      }`}
    >
      SP
      <div className={styles.spotlight} />
      TLITE!
    </div>
  );
};
