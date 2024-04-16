import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { COMICO, PP_NEUE_MONTREAL } from './util/fonts';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './theme-config.css';
import './globals.scss';
import { Providers } from './components/Providers';

export const metadata: Metadata = {
  title: 'Spotlite!',
  description: 'Educational Pictionary',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${COMICO.className} ${COMICO.variable} ${PP_NEUE_MONTREAL.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
