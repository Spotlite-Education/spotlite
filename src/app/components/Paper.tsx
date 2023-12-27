import { HTMLAttributes } from 'react';
import styles from './Paper.module.scss';

type PaperProps = {} & HTMLAttributes<HTMLDivElement>;

const Paper = ({ className, children, style, ...props }: PaperProps) => {
  return (
    <div className={`${styles.wrapper} ${className}`} style={style} {...props}>
      {children}
    </div>
  );
};

export default Paper;
