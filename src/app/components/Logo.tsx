import styles from './Logo.module.scss';

interface LogoProps {
  color?: 'white' | 'purple' | 'black';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'bordered';
}

export const Logo = ({ color, size, variant }: LogoProps) => {
  return (
    <div
      className={`${styles.wrapper} ${styles[size || 'md']} ${
        variant ? styles[variant] : undefined
      }`}
      style={{
        color:
          color === 'white'
            ? 'var(--off-white)'
            : color === 'black'
            ? 'var(--dark-text)'
            : undefined,
      }}
    >
      <div className={styles.sp} data-text="SP">
        SP
      </div>
      <div className={styles.spotlight} />
      <div className={styles.tlite} data-text="TLITE!">
        TLITE!
      </div>
    </div>
  );
};
