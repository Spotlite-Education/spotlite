import { HTMLAttributes } from 'react';
import styles from './Paper.module.scss';
import Canvas from './Canvas';

type PaperProps = {
  drawable?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const Paper = ({
  drawable,
  className,
  children,
  style,
  ...props
}: PaperProps) => {
  return (
    <div className={`${styles.wrapper} ${className}`} style={style} {...props}>
      {children}
      {drawable && <Canvas />}
    </div>
  );
};

export default Paper;
