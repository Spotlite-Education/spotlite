import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

type ButtonProps = {
  fill?: 'primary' | 'secondary' | string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  fill,
  className,
  style,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.wrapper} ${className}`}
      style={{
        color: fill === 'secondary' ? 'var(--input-text-color)' : 'var(--text-color)',
        backgroundColor:
          fill === 'secondary'
            ? 'var(--text-color)'
            : 'var(--accent-color)',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
