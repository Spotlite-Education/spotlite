import localFont from 'next/font/local';

export const COMICO = localFont({
  src: '../assets/fonts/Comico-Regular.otf',
  variable: '--font-comico',
});

export const PP_NEUE_MONTREAL = localFont({
  src: [
    {
      weight: '300',
      path: '../assets/fonts/PPNeueMontreal-Thin.otf',
    },
    {
      weight: '400',
      path: '../assets/fonts/PPNeueMontreal-Book.otf',
    },
    {
      weight: '500',
      path: '../assets/fonts/PPNeueMontreal-Medium.otf',
    },
    {
      weight: '600',
      path: '../assets/fonts/PPNeueMontreal-Bold.otf',
    },
    {
      weight: '400',
      path: '../assets/fonts/PPNeueMontreal-Italic.otf',
      style: 'italic',
    },
    {
      weight: '600',
      path: '../assets/fonts/PPNeueMontreal-SemiBoldItalic.otf',
      style: 'italic',
    },
  ],
  variable: '--font-pp-neue-montreal',
});
