import { Rowdies } from 'next/font/google';
import { Red_Hat_Display } from 'next/font/google';

export const ROWDIES = Rowdies({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-rowdies',
});

export const REDHAT = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-redhat',
});
