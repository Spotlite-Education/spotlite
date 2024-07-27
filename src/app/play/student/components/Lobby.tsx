'use client';
import { GameState } from '@/types/GameState';
import styles from './Lobby.module.scss';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import {
  CubicBezierCurve,
  CubicBezierCurveObject,
  CubicBezierSpline,
  Curve,
  Stroke,
  Vector2,
} from '@/app/lib/Curves';
import { socket } from '../../layout';
import { useQuery } from '@tanstack/react-query';
import { CharacterContext } from '@/context/CharacterContext';
import { Character } from '../../components/Character';

const TIPS = [
  'Make your answers short and sweet! Your classmates have to enter them exactly.',
  'Having trouble making your question? Try looking at your notes!',
  'Remember to be respectful and kind to your classmates!',
  "You can answer multiple times, so don't worry if you don't get it right the first time!",
  "Everybody's questions get saved at the end of the game. You can use them to review later!",
];

interface CanvasProps {
  paintbrushColor: string;
  curves: CubicBezierCurveObject[];
  addCurve: (curve: CubicBezierCurveObject) => void;
}

const Canvas = ({ paintbrushColor, curves, addCurve }: CanvasProps) => {
  const [canvasHovered, setCanvasHovered] = useState<boolean>(false);
  const [relativeMousePosition, setRelativeMousePosition] = useState<Vector2>({
    x: 0,
    y: 0,
  });

  const STROKE_WIDTH = 10;

  const [currStroke, setCurrStroke] = useState<Stroke | null>(null);

  const handleCanvasHover = () => {
    setCanvasHovered(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const relativeCoords: Vector2 = {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    };
    setRelativeMousePosition(relativeCoords);

    window.requestAnimationFrame(() => {
      if (!currStroke) {
        return;
      }

      const lastPoint = currStroke.points.at(-1);

      if (
        !lastPoint ||
        relativeCoords.x !== lastPoint.x ||
        relativeCoords.y !== lastPoint.y
      ) {
        setCurrStroke(prev => {
          if (prev) {
            return {
              ...prev,
              points: [...prev?.points, relativeCoords],
            };
          } else {
            return null;
          }
        });
      }
    });
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!currStroke) {
      return;
    }

    const simplfiedPoints = Curve.simplify(currStroke.points, 5, 0.1);
    const curve = new CubicBezierCurve(
      { ...currStroke, points: simplfiedPoints },
      STROKE_WIDTH
    );
    addCurve(curve.toObject());
    setCurrStroke(null);
  };

  const handleMouseDown = () => {
    setCurrStroke({ points: [], color: paintbrushColor });
  };

  const handleCanvasUnhover = () => {
    setCanvasHovered(false);
  };

  return (
    <div
      className={styles.canvas}
      onMouseEnter={handleCanvasHover}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleCanvasUnhover}
    >
      <svg width="100%" height="100%" className={styles.drawn}>
        {curves.map((curve, i) => (
          <g key={i}>
            {curve.splines.map((spline, j) => (
              <path
                key={j}
                d={CubicBezierSpline.getSvgPath(spline)}
                stroke={curve.color}
                strokeWidth={curve.width}
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
            ))}
          </g>
        ))}
        {currStroke && (
          <polyline
            points={currStroke.points.map(pt => pt.x + ',' + pt.y).join(' ')}
            stroke={currStroke.color}
            strokeWidth={STROKE_WIDTH}
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
      <motion.div
        className={styles.paintbrushWrapper}
        animate={{
          x: relativeMousePosition.x - 4,
          y: `calc(${relativeMousePosition.y + 7}px - 275%)`,
          scale: canvasHovered ? 1 : 0.5,
          opacity: canvasHovered ? 1 : 0,
        }}
        initial={{ x: 0, y: 0 }}
        transition={{
          ease: 'linear',
          duration: 0,
          scale: { duration: 0.1 },
          opacity: { duration: 0.1 },
        }}
      >
        <svg
          className={styles.paintbrush}
          width={285 / 2}
          height={379 / 2}
          viewBox="0 0 285 379"
          fill="none"
        >
          <path
            d="M61.7292 270.443C58.1055 275.498 54.9541 284.145 54.9541 290.538C57.5689 291.845 58.5909 292.616 61.8832 292.616C65.4579 292.616 67.6763 291.631 71.045 290.384C82.5475 286.124 90.0098 269.989 96.8365 260.704C104.69 250.023 110.649 238.307 120.164 228.792C124.438 224.519 127.198 219.875 130.481 214.857C134.595 208.569 138.927 202.683 143.569 196.764C148.906 189.96 153.314 182.556 158.428 175.592C163.509 168.673 169.898 163.252 176.675 158.077C192.874 145.707 206.917 129.984 221.098 115.386C230.392 105.818 236.454 93.6494 245.273 83.6278C250.247 77.9757 255.043 72.2078 259.67 66.2666C268.063 55.4887 276.407 44.2509 280.303 31.0053C281.792 25.942 284.785 2.22371 274.837 3.01957C265.944 3.731 261.764 10.487 255.705 15.9153C246.971 23.7391 238.579 31.0257 230.799 39.8592C219.303 52.9103 207.56 65.6527 196.538 79.1239C159.561 124.318 125.212 171.449 96.2976 222.209C86.3351 239.699 73.361 254.22 61.7292 270.443Z"
            fill="#8000FF"
            stroke="#8000FF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M65.7339 287.548C56.6896 287.548 46.8971 286.342 37.9661 287.618C34.153 288.163 30.2957 294.029 27.5882 296.383C19.9683 303.009 14.6006 312.219 10.4787 321.346C6.21143 330.795 5.14956 336.564 5.14956 346.87C5.14956 353.15 5.62546 359.604 4.51847 365.803C3.32871 372.465 3.88739 381.293 3.88739 368.888C3.88739 354.672 13.1092 352.81 25.0639 348.132C29.4426 346.419 32.843 345.085 36.774 342.382C42.3908 338.521 48.8192 337.458 54.3042 333.687C62.1855 328.269 64.7284 314.926 66.7156 306.481C68.0966 300.611 66.3036 293.043 64.4718 287.548"
            stroke="#8000FF"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M7.83374 345.101C7.83374 341.321 5.68733 329.397 11.3368 328.142C14.1495 327.517 12.7361 336.753 12.6157 337.873C12.1903 341.829 6.63234 352.197 9.44627 349.383C13.1152 345.714 16.2769 342.234 20.734 339.263C22.0363 338.394 30.5001 333.878 27.1841 337.984C23.8105 342.161 21.0446 345.991 16.3412 348.604C14.7736 349.475 13.2768 348.826 11.8373 350.106C3.61592 357.413 31.039 331.063 41.252 335.148C41.6875 335.322 34.2192 340.015 33.4118 340.319C30.0464 341.587 25.301 340.958 22.3465 342.599C17.861 345.091 19.9985 339.677 21.29 337.094C22.865 333.944 21.7382 331.426 19.6219 329.309C17.5745 327.262 16.8417 318.185 16.8417 321.08C16.8417 325.009 16.8417 328.939 16.8417 332.868C16.8417 333.403 16.8417 338.327 16.8417 335.593C16.8417 333.262 17.7912 327.769 16.3412 326.029C13.9515 323.161 17.9939 316.38 14.8399 323.082C13.5005 325.928 9.81719 330.08 13.839 331.867C17.8205 333.637 18.8434 329.114 18.8434 332.868C18.8434 339.991 17.8426 330.674 17.8426 328.086"
            stroke={paintbrushColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export const DrawCharacter = () => {
  const [pencilScope, animate] = useAnimate();
  useEffect(() => {
    const PENCIL_JITTER = 20;

    const pencilAnimation = async () => {
      // show pencil
      await animate(pencilScope.current, { scale: 1 });

      // move pencil
      animate(
        pencilScope.current,
        {
          rotate: [
            0,
            -PENCIL_JITTER,
            0,
            PENCIL_JITTER,
            0,
            -PENCIL_JITTER,
            0,
            PENCIL_JITTER,
            0,
            -PENCIL_JITTER,
            0,
            PENCIL_JITTER,
            0,
            -PENCIL_JITTER,
            0,
            PENCIL_JITTER,
            0,
            -PENCIL_JITTER,
            0,
          ],
        },
        { duration: 1, delay: 0.1 }
      );
      await animate(
        pencilScope.current,
        { x: 645 },
        { delay: 0.1, duration: 0.2 }
      );
      await animate(pencilScope.current, { y: 375 }, { duration: 0.1 });
      await animate(pencilScope.current, { x: 0 }, { duration: 0.35 });
      await animate(pencilScope.current, { y: 0 }, { duration: 0.25 });

      // drop pencil
      await animate(
        pencilScope.current,
        { x: 50, y: -100, rotate: 30, opacity: 1 },
        {
          delay: 0.05,
          ease: 'circOut',
        }
      );
      animate(
        pencilScope.current,
        { x: 100, y: 300, scale: 0, rotate: 65, opacity: 0 },
        { ease: 'circIn' }
      );
    };

    pencilAnimation();
  }, []);

  const swatchVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    shown: {
      scale: 1,
      opacity: 1,
    },
  };

  const PAINTBRUSH_COLORS = [
    'var(--purple)',
    '#FF005C',
    '#FFBD5A',
    '#41DD1A',
    '#7F5D35',
  ];
  const [paintbrushColor, setPaintbrushColor] = useState<string>(
    PAINTBRUSH_COLORS[1]
  );

  const [curves, setCurves] = useState<CubicBezierCurveObject[]>([]);

  const handleAddCurve = (curve: CubicBezierCurveObject) => {
    setCurves(prev => [...prev, curve]);
  };

  const [submittingDrawing, setSubmittingDrawing] = useState<boolean>(false);

  const handleSubmitDrawing = async () => {
    if (curves.length === 0 || submittingDrawing) {
      return;
    }

    try {
      setSubmittingDrawing(true);

      const res = await fetch(
        'http://localhost:8000/api/game/submitCharacter',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionID: sessionStorage.getItem('sessionID'),
            curves,
          }),
        }
      );

      const { success } = await res.json();
      if (success) {
        socket.emit('queryGameState');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDrawing(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <motion.span
        className={styles.prompt}
        initial={{ y: -200, scale: 2, rotate: -180, opacity: 0 }}
        animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          delay: 2.2,
        }}
      >
        Draw Your Character!
      </motion.span>
      <motion.span
        className={styles.noEraser}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
      >
        (No, you can&apos;t erase)
      </motion.span>
      <div className={styles.editorWrapper}>
        <div className={styles.frame}>
          <div className={styles.pencilWrapper}>
            <motion.img
              ref={pencilScope}
              className={styles.pencil}
              src="/assets/pencil.svg"
              initial={{ x: 0, y: 0, scale: 0 }}
            />
          </div>
          <div className={styles.canvasWrapper}>
            <svg
              width="700"
              height="431"
              viewBox="0 0 700 431"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M23.2514 18.3446C20.3539 20.1416 12.1622 28.5151 10.4011 30.7165C8.68139 32.8661 9.15697 35.0046 9.15697 37.8355V64.9293C9.15697 90.0483 5.1019 115.195 4.24968 140.336C2.7077 185.824 8.45962 229.689 17.3127 274.215C21.5287 295.419 22.8421 316.947 22.8421 338.563C22.8421 349.494 23.9181 360.331 24.0862 371.255C24.1466 375.179 23.9872 383.305 25.6068 387.152C30.2473 398.173 47.626 410.044 58.299 413.831C73.0768 419.074 89.3124 419.078 104.745 420.12C123.248 421.371 141.791 421.468 160.315 422.056C205.298 423.484 250.276 423.231 295.3 423.231H346.723C368.678 423.231 390.4 425.332 412.315 425.65C456.888 426.296 501.531 424.566 546.056 426.686C563.012 427.494 580.089 426.963 597.064 426.963C605.63 426.963 614.843 427.959 623.329 426.686C639.491 424.262 671.076 425.345 678.207 406.09C688.7 377.759 685.948 347.518 685.948 317.482V259.7C685.948 230.317 690.474 201.32 692.1 172.06C694.463 129.522 695.901 87.2114 695.901 44.5398C695.901 30.9755 685.033 25.8573 675.374 18.3446C666.007 11.0597 648.786 9.80018 637.705 7.70057C619.909 4.3288 602.334 3.96826 584.208 3.96826C516.592 3.96826 449.833 15.1652 382.111 15.1652C315.961 15.1652 249.619 16.9358 183.608 12.677C160.206 11.1672 136.845 11.4329 113.385 11.4329C97.0028 11.4329 80.7839 13.9211 64.5195 13.9211C54.8724 13.9211 44.7272 16.4093 35.2831 16.4093C33.1411 16.4093 26.9929 17.0562 23.2514 18.3446ZM23.2514 18.3446C21.7941 18.8464 20.7019 19.4455 20.3539 20.1416M41.0174 31.394C29.276 31.394 31.5456 77.7752 31.5456 86.0546C31.5456 133.029 33.9135 179.738 33.9135 226.751C33.9135 252.111 36.2445 277.734 38.5372 302.937L38.7152 304.894C39.5938 314.559 43.1734 323.821 43.3854 333.573C43.5617 341.684 44.2158 352.624 46.9373 360.278L47.0846 360.692C51.1575 372.152 53.3755 378.393 66.473 382.379C83.6304 387.601 102.073 392.117 120.081 392.509C129.192 392.707 138.278 394.877 147.444 394.877H253.016C268.586 394.877 283.712 396.56 299.126 398.166C333.09 401.704 367.424 401.981 401.54 401.981C456.721 401.981 511.418 393.693 566.706 393.693C577.445 393.693 588.199 393.851 598.936 393.693C609.134 393.543 619.109 390.888 629.194 390.141C636.424 389.605 640.844 383.238 646.625 380.669C654.057 377.366 656.828 363.203 658.464 356.332C662.805 338.103 664.976 317.65 664.976 298.974C664.976 278.943 664.351 259.769 660.898 240.038C659.048 229.468 660.307 218.403 658.793 207.807C657.185 196.551 654.714 185.303 653.4 173.998C650.428 148.441 650.768 123.151 650.768 97.434C650.768 84.4206 653.22 68.5426 647.874 56.3235C643.6 46.5536 626.701 41.3106 616.696 40.8659C600.848 40.1615 584.938 39.6819 568.942 39.6819H216.115C175.104 39.6819 134.348 36.13 93.3758 36.13C81.5517 36.13 69.7931 33.762 58.1852 33.762C54.4857 33.762 40.1528 35.5847 38.6494 32.578"
                stroke="#8000FF"
                strokeWidth="7"
                strokeLinecap="round"
                initial={{ strokeDasharray: 2100, strokeDashoffset: -2100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
              />
            </svg>
            <Canvas
              paintbrushColor={paintbrushColor}
              curves={curves}
              addCurve={handleAddCurve}
            />
          </div>
        </div>
        <motion.div
          className={styles.colors}
          initial="hidden"
          animate="shown"
          transition={{ delayChildren: 2.5, staggerChildren: 0.1 }}
        >
          {PAINTBRUSH_COLORS.map((color, i) => (
            <motion.svg
              key={i}
              className={styles.color}
              width="50"
              height="49"
              viewBox="0 0 50 49"
              fill="none"
              onClick={() => setPaintbrushColor(color)}
              variants={swatchVariants}
              whileTap={{ scale: 0.85 }}
            >
              <path
                d="M19.8322 5C13.6899 9.60672 9.41171 14.325 5.32941 20.74C3.90181 22.9834 7.53975 19.9717 8.14749 19.5715C14.6889 15.2638 21.2632 9.83922 28.3552 6.51214C28.6561 6.37098 33.7355 3.99578 33.304 5.7217C32.7312 8.0127 29.5431 10.5524 28.0802 12.217C23.9852 16.8769 19.6283 21.2904 15.3989 25.8263C14.8738 26.3894 7.19407 32.7648 11.6529 32.1498C18.7818 31.1665 25.1018 25.3662 30.589 21.118C32.1566 19.9045 33.4358 18.276 35.2973 17.5095C36.1615 17.1537 30.1508 26.0684 29.5924 26.7886C27.0318 30.0904 24.2708 33.1685 21.4818 36.2738C20.278 37.6141 17.7262 39.849 17.2203 41.7037C16.9667 42.6337 21.9333 40.846 22.1691 40.7415C25.2457 39.3777 28.1971 37.6817 31.242 36.2394C31.9175 35.9194 40.1687 30.9695 40.7272 31.7374C41.8831 33.3268 34.6604 41.1269 33.5789 42.4598C30.4313 46.3395 35.1079 43.1328 36.6719 42.1161C39.2061 40.4689 42.3499 38.1157 45.1949 37.1673"
                stroke={color}
                strokeWidth="9"
                strokeLinecap="round"
              />
            </motion.svg>
          ))}
        </motion.div>
      </div>
      <div className={styles.submitPrompt} onClick={handleSubmitDrawing}>
        Press{' '}
        <motion.button
          whileTap={{ scale: 0.85 }}
          disabled={curves.length === 0 || submittingDrawing}
        >
          I&apos;m locked in
        </motion.button>{' '}
        when you&apos;re done!
      </div>
    </div>
  );
};

const WaitingRoom = () => {
  const character = useContext(CharacterContext);

  const [tipIndex, setTipIndex] = useState<number>(0);

  useEffect(() => {
    const cycleTip = setInterval(
      () => setTipIndex(prev => (prev + 1) % TIPS.length),
      7500
    );

    return () => {
      clearInterval(cycleTip);
    };
  }, []);

  return (
    <div className={styles.waitingRoom}>
      <span className={styles.title}>You&apos;re In!</span>
      <Character
        width={700 - 95}
        height={431 - 90}
        curves={character || []}
        animated
      />
      <span className={styles.tip}>Tip: {TIPS[tipIndex]}</span>
    </div>
  );
};

export const Lobby = ({ gameState }: { gameState: GameState }) => {
  if (gameState.playerInfo?.characterSubmitted) {
    return <WaitingRoom />;
  } else {
    return <DrawCharacter />;
  }
};
