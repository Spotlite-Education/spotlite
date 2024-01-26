'use client';
import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styles from './Input.module.scss';
//import { addStyles, EditableMathField } from 'react-mathquill';
import { useState, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

type LongInputProps = { className?: string };
type InputProps = {
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;
//addStyles();

const Input = ({ className, ...props }: InputProps) => {
  return <input className={`${styles.wrapper} ${className}`} {...props} />;
};

const LongInput = ({ className, ...props }: LongInputProps) => {
  return (
    <TextareaAutosize className={`${styles.wrapper} ${className}`} {...props} />
  );
};

type IconInputProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
} & LongInputProps;

export const IconInput = ({
  left,
  right,
  className,
  ...props
}: IconInputProps) => {
  return (
    <div className={`${styles.iconInputWrapper} ${className}`}>
      {left ? left : <div />}
      <TextareaAutosize className={styles.iconInput} {...props} />
      {right ? right : <div />}
    </div>
  );
};

// export const MathInput = ({ className, ...props }: InputProps) => {
//   const [latex, setLatex] = useState('');

//   return (
//     <div className={styles.mathInputWrapper}>
//       <EditableMathField
//         className={styles.mathInput}
//         latex={latex}
//         onChange={mathField => {
//           setLatex(mathField.latex());
//         }}
//       />
//     </div>
//   );
// };
export default Input;
