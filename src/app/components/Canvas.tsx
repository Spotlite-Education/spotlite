import { useState } from 'react';
import { useDraw } from '../hooks/useDraw';
import { ChromePicker } from 'react-color';
import styles from './Canvas.module.scss';

const Canvas = ({}) => {
  const [color, setColor] = useState<string>('#000');
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

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
    <div className={styles.canvas}>
      <canvas
        width={400}
        height={300}
        ref={canvasRef}
        onMouseDown={onMouseDown}
      />
      <button type="button" onClick={clear}>
        Clear canvas
      </button>
      <ChromePicker color={color} onChange={e => setColor(e.hex)} />
    </div>
  );
};

export default Canvas;
