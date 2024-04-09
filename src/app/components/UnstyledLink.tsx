import Link from 'next/link';
import styles from './UnstyledLink.module.scss';
import { ComponentProps } from 'react';

export const UnstyledLink = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Link>) => {
  return (
    <Link className={`${styles.wrapper} ${className}`} {...props}>
      {children}
    </Link>
  );
};
