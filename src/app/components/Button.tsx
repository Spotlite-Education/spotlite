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
        color: fill === 'secondary' ? 'var(--text-color)' : undefined,
        backgroundColor:
          fill === 'primary'
            ? undefined
            : fill === 'secondary'
            ? 'var(--accent-color)'
            : fill
            ? fill
            : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
