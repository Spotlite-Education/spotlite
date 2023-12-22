import { InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

type InputProps = {} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: InputProps) => {
  return <input className={`${styles.wrapper} ${className}`} {...props} />;
};

export default Input;
