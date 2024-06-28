import { Pangolin } from 'next/font/google';
import localFont from 'next/font/local';

export const COMICO = localFont({
  src: '../assets/fonts/Comico-Regular.otf',
  variable: '--font-comico',
});

export const PANGOLIN = Pangolin({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pangolin',
});
