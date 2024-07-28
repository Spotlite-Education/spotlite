import { motion } from 'framer-motion';
import styles from './AnimatedLogo.module.scss';

const CHAR_VARIANTS = [
  {
    initial: {
      x: -250,
      y: -150,
      scale: 2,
      rotate: -12.32 + 180,
      opacity: 0,
    },
    settled: {
      x: 0,
      y: 6,
      scale: 1,
      opacity: 1,
      rotate: -12.32,
    },
  },
  {
    initial: {
      x: -50,
      y: -250,
      scale: 2,
      rotate: 10.54 - 180,
      opacity: 0,
    },
    settled: {
      x: 0,
      y: -1,
      scale: 1,
      rotate: 10.54,
      opacity: 1,
    },
  },
  {
    initial: {
      x: -56,
      y: 200,
      scale: 2,
      rotate: 2.43 + 180,
      opacity: 0,
    },
    settled: {
      x: 0,
      y: 4,
      scale: 1,
      rotate: 2.43,
      opacity: 1,
    },
  },
  {
    initial: {
      x: 140,
      y: -150,
      scale: 2,
      rotate: -14.06 - 180,
      opacity: 0,
    },
    settled: {
      x: 0,
      y: -5,
      scale: 1,
      rotate: -14.06,
      opacity: 1,
    },
  },
  {
    initial: {
      x: 50,
      y: 220,
      scale: 2,
      rotate: 5.63 + 180,
      opacity: 0,
    },
    settled: {
      x: 0,
      y: 5.3,
      scale: 1,
      rotate: 5.63,
      opacity: 1,
    },
  },
  {
    initial: {
      x: 230,
      y: -120,
      scale: 2,
      rotate: -7.55 - 180,
      opacity: 0,
    },
    settled: {
      x: 0,
      y: -5.3,
      scale: 1,
      rotate: -7.55,
      opacity: 1,
    },
  },
  {
    initial: {
      x: 200,
      y: 150,
      scale: 2,
      rotate: 3.42 + 180,
      opacity: 0,
    },
    settled: {
      x: 0,
      y: 1,
      scale: 1,
      rotate: 3.42,
      opacity: 1,
    },
  },
  {
    initial: {
      x: 260,
      y: -60,
      scale: 2,
      rotate: -5.6 - 180,
      opacity: 0,
    },
    settled: {
      x: 0,
      y: -2,
      scale: 1,
      rotate: 7.19,
      opacity: 1,
    },
  },
  {
    initial: {
      x: 100,
      y: -120,
      scale: 2,
      rotate: 7.19 + 180,
      opacity: 0,
    },
    settled: {
      x: 0,
      y: 7.6,
      scale: 1,
      rotate: -5.6,
      opacity: 1,
    },
  },
];

const CHARS = 'SPOTLITE!'.split('');

export const AnimatedLogo = () => {
  return (
    <motion.div
      className={styles.animatedLogo}
      variants={{
        initial: {},
        settled: {
          transition: {
            staggerChildren: 0.03,
          },
        },
      }}
      initial="initial"
      animate="settled"
    >
      {CHARS.map((char, i) => {
        return (
          <motion.div
            key={i}
            className={styles.char}
            variants={CHAR_VARIANTS[i]}
          >
            {char}
          </motion.div>
        );
      })}
    </motion.div>
  );
};
