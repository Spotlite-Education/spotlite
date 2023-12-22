import { InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

type InputProps = {} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: InputProps) => {
  return <input className={`${styles.wrapper} ${className}`} {...props} />;
};

type IconInputProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
} & InputProps;

export const IconInput = ({
  left,
  right,
  className,
  ...props
}: IconInputProps) => {
  return (
    <div className={`${styles.iconInputWrapper} ${className}`}>
      {left ? left : <div />}
      <input {...props} />
      {right ? right : <div />}
    </div>
  );
};

export default Input;
