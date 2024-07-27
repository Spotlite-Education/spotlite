import type { Metadata } from 'next';
import { COMICO, PANGOLIN } from './util/fonts';
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
        className={`${PANGOLIN.className} ${PANGOLIN.variable} ${COMICO.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
