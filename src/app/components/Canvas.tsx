import { useState, useRef, useEffect } from 'react';
import { useDraw } from '../hooks/useDraw';
import { ChromePicker } from 'react-color';
import Button from './Button';
import styles from './Canvas.module.scss';

const Canvas = ({}) => {
  const [color, setColor] = useState<string>('#000');
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);
  const containerRef = useRef(null);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (!containerRef.current) return;

  //     const context = canvasRef.current.getContext('2d');

  //     const imageData = context.getImageData(
  //       0,
  //       0,
  //       canvasRef.current.width,
  //       canvasRef.current.height
  //     );

  //     context.canvas.width = containerRef.current?.offsetWidth;

  //     // Scale the existing drawing elements
  //     const scaleX = context.canvas.width / imageData.width;
  //     const scaleY = context.canvas.height / imageData.height;

  //     context.putImageData(imageData, 0, 0);
  //   };

  //   const resizeObserver = new ResizeObserver(handleResize);
  //   resizeObserver.observe(containerRef.current);

  //   return () => {
  //     resizeObserver.unobserve(containerRef.current);
  //   };
  // });

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 2.5;

    let startPoint = prevPoint ?? currentPoint;

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <div className={styles.canvasContainer} ref={containerRef}>
      <canvas
        className={styles.canvas}
        height={450}
        width={750}
        ref={canvasRef}
        onMouseDown={onMouseDown}
      />
      <Button type="button" onClick={clear}>
        Clear canvas
      </Button>
      {/* <ChromePicker color={color} onChange={e => setColor(e.hex)} /> */}
    </div>
  );
};

export default Canvas;
