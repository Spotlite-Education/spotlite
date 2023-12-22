import { Rowdies } from 'next/font/google';
import localFont from 'next/font/local';

export const ROWDIES = Rowdies({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-rowdies',
});

export const GENERAL_SANS = localFont({
  src: '../assets/fonts/GeneralSans-Variable.ttf',
  variable: '--font-general-sans',
});

export const GENERAL_SANS_ITALIC = localFont({
  src: '../assets/fonts/GeneralSans-VariableItalic.ttf',
  variable: '--font-general-sans-italic',
});
