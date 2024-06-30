import { useEffect, useMemo } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import styles from './RingSelect.module.scss';

export const RingSelect = ({
  items,
  selectedIndex,
  onSelect,
  radiusX,
  radiusY,
}: {
  items: React.ReactNode[];
  selectedIndex: number;
  onSelect: (i: number) => any;
  radiusX: number;
  radiusY: number;
}) => {
  const animateIndex = useMotionValue(0);
  const numItems = items.length;
  const deltaTheta = useMemo(() => (2 * Math.PI) / items.length, [items]);

  const handleSelectItem = (i: number) => {
    onSelect(i);
  };

  const distBetweenIndices = (i: number) => {
    if (i > selectedIndex) {
      return Math.min(i - selectedIndex, numItems + selectedIndex - i);
    } else {
      return Math.min(numItems - selectedIndex + i, selectedIndex - i);
    }
  };

  useEffect(() => {
    if (selectedIndex === animateIndex.get()) {
      return;
    }

    // either you can hop to the right (wrapping if necessary)
    // or you can hop to the left (wrapping if necessary)

    const currIndex = animateIndex.get();
    let animateIndexTarget = currIndex;

    if (selectedIndex > currIndex) {
      // compare si - ci (hop right) and L + ci - si (hop left)
      if (selectedIndex - currIndex <= numItems + currIndex - selectedIndex) {
        // should hop right
        animateIndexTarget = selectedIndex;
      } else {
        // should hop left
        animateIndexTarget = selectedIndex - numItems;
      }
    } else {
      // compare L - ci + si (hop right) and ci - si (hop left)
      if (numItems - currIndex + selectedIndex < currIndex - selectedIndex) {
        // should hop right
        animateIndexTarget = selectedIndex + numItems;
      } else {
        // should hop left
        animateIndexTarget = selectedIndex;
      }
    }

    animate(animateIndex, animateIndexTarget, {
      duration: 0.5,
      ease: 'easeOut',
      onComplete: () => animateIndex.set(selectedIndex),
    });
  }, [selectedIndex]);

  return (
    <div
      className={styles.wrapper}
      style={{
        width: radiusX * 2,
        height: radiusY * 2,
      }}
    >
      {items.map((item, i) => {
        const theta = useTransform(
          () => -(i - animateIndex.get()) * deltaTheta + Math.PI / 2
        );
        const x = useTransform(() => Math.cos(theta.get()) * radiusX + radiusX);
        const y = useTransform(() => Math.sin(theta.get()) * radiusY + radiusY);

        const distFromCenter = distBetweenIndices(i);
        const inFront = distFromCenter <= 1;

        return (
          <div
            key={i}
            className={styles.itemAlign}
            style={{
              zIndex: inFront ? 1 : 0,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              className={styles.item}
              animate={{
                scale:
                  distFromCenter === 0 ? 1 : distFromCenter === 1 ? 0.8 : 0.5,
                opacity:
                  distFromCenter === 0 ? 1 : distFromCenter === 1 ? 0.85 : 0.5,
              }}
              style={{
                x,
                y,
              }}
              onClick={() => handleSelectItem(i)}
            >
              {item}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
