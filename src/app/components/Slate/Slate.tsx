'use client';
import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './Slate.module.css';
import type {
  Actions,
  CanvasAction,
  Controllable,
  Line,
  Size,
  Text,
  Theme,
} from './types/Properties';
import { MdTextFields } from 'react-icons/md';
import { RiAddFill, RiEraserFill, RiSubtractFill } from 'react-icons/ri';
import { IoIosRedo, IoIosUndo, IoMdTrash } from 'react-icons/io';
import { Popover } from 'react-tiny-popover';
import { HexColorPicker } from 'react-colorful';

type SlateProps = Theme &
  Controllable &
  Actions & {
    size: Size;
    theme?: Theme;
  };

export const Slate = ({
  value,
  setValue,
  undos,
  setUndos,
  size,
  theme,
  ...props
}: SlateProps) => {
  // Process props

  const determineDimensions = (): {
    width: number | string;
    height: number | string;
  } => {
    if ('fill' in size) {
      return {
        width: '100%',
        height: '100%',
      };
    }

    return size;
  };

  const { width, height } = determineDimensions();

  // Whether the canvas is readonly (spectator) or not
  const determineType = (): 'readonly' | 'editable' => {
    if ('readonly' in props && props.readonly === true) {
      return 'readonly';
    }
    return 'editable';
  };

  const type = determineType();

  // Determine editor defaults
  const determineEditorDefaults = (): {
    numSteps: number;
    defaultSize: number;
    minStrokeSize: number;
    maxStrokeSize: number;
    minTextSize: number;
    maxTextSize: number;
    defaultColor: string;
    eraserColor: string;
  } => {
    const defaults = {
      numSteps: 10,
      defaultSize: 5,
      minStrokeSize: 2,
      maxStrokeSize: 32,
      minTextSize: 12,
      maxTextSize: 50,
      defaultColor: 'black',
      eraserColor: 'white',
    };

    if (theme?.canvas?.numSteps) defaults.numSteps = theme.canvas.numSteps;
    if (theme?.canvas?.defaultSizeStep)
      defaults.defaultSize = theme.canvas.defaultSizeStep;
    if (theme?.canvas?.minStrokeSize)
      defaults.minStrokeSize = theme.canvas.minStrokeSize;
    if (theme?.canvas?.maxStrokeSize)
      defaults.maxStrokeSize = theme.canvas.maxStrokeSize;
    if (theme?.canvas?.minTextSize)
      defaults.minTextSize = theme.canvas.minTextSize;
    if (theme?.canvas?.maxTextSize)
      defaults.maxTextSize = theme.canvas.maxTextSize;
    if (theme?.canvas?.defaultColor)
      defaults.defaultColor = theme.canvas.defaultColor;
    if (theme?.canvas?.background)
      defaults.eraserColor = theme.canvas.background;

    return defaults;
  };

  const editorDefaults = determineEditorDefaults();

  // editor states
  const [note, setNote] = useState<string>('');

  // canvas states
  const controlled = !!value && !!setValue && !!undos && !!setUndos;

  const [actions, setActions] = useState<CanvasAction[]>([]);
  const [actionUndos, setActionUndos] = useState<CanvasAction[]>([]);

  useEffect(() => {
    if (actions.length > 0 || actionUndos.length > 0) {
      console.log('action leak detected!');
    }
  }, [actions, actionUndos]);

  const clearCanvas = () => {
    if (controlled ? value!.length === 0 : actions.length === 0) return;

    if (
      controlled
        ? value![value.length - 1].type !== 'clear'
        : actions[actions.length - 1].type !== 'clear'
    ) {
      controlled
        ? setValue((prev: CanvasAction[]) => [
            ...prev,
            { type: 'clear', data: null },
          ])
        : setActions(prev => [...prev, { type: 'clear', data: null }]);
    }
  };

  const undo = () => {
    if (controlled ? value.length === 0 : actions.length === 0) return;

    const actionsCopy = controlled ? value.slice() : actions.slice();
    const lastAction = actionsCopy.pop()!;
    if (controlled) {
      setUndos(prev => [...prev, lastAction]);
      setValue(actionsCopy);
    } else {
      setActionUndos(prev => [...prev, lastAction]);
      setActions(actionsCopy);
    }
  };

  const redo = () => {
    if (controlled ? undos.length === 0 : actionUndos.length === 0) return;

    const undosCopy = controlled ? undos.slice() : actionUndos.slice();
    const lastUndo = undosCopy.pop()!;

    const actionsWithRedo = controlled ? value.slice() : actions.slice();
    actionsWithRedo.push(lastUndo);

    if (controlled) {
      setValue(actionsWithRedo);
      setUndos(undosCopy);
    } else {
      setActions(actionsWithRedo);
      setActionUndos(undosCopy);
    }
  };

  const [inTextMode, setInTextMode] = useState<boolean>(false);
  const [erasing, setErasing] = useState<boolean>(false);

  useEffect(() => {
    // entering text mode
    if (inTextMode) {
      setErasing(false);
      setNote('Text Mode');
    } else {
      if (!erasing) {
        setNote('');
      }
    }
  }, [inTextMode]);

  useEffect(() => {
    // entering erasing mode
    if (erasing) {
      setInTextMode(false);
      setNote('Erasing');
    } else {
      if (!inTextMode) {
        setNote('');
      }
    }
  }, [erasing]);

  // default is based on min stroke size because drawing is the default operation
  const [elementSize, setElementSize] = useState<number>(
    editorDefaults.defaultSize
  );
  const [elementColor, setElementColor] = useState<string>(
    editorDefaults.defaultColor
  );

  const [colorSelectOpen, setColorSelectOpen] = useState<boolean>(false);

  // resets
  useEffect(() => {
    setNote('');
    // reset editor state
    if (type === 'readonly') {
      setElementSize(editorDefaults.defaultSize);
      setElementColor(editorDefaults.defaultColor);
      setInTextMode(false);
      setErasing(false);
    }
  }, [type]);

  return (
    <div
      className={styles.slateWrapper}
      style={{
        width,
        height,
        border: theme?.border || undefined,
        borderRadius: theme?.rounding,
        backgroundColor: theme?.background,
      }}
    >
      <div className={styles.editingSpace}>
        <div
          className={styles.note}
          style={{
            transform: `translateY(${note ? 0 : -100}%)`,
            color: theme?.canvas?.note?.textColor,
            borderBottom: theme?.canvas?.note?.border || undefined,
            backgroundColor: theme?.canvas?.note?.background,
          }}
        >
          {note}
        </div>
        <Canvas
          value={controlled ? value : actions}
          setValue={controlled ? setValue : setActions}
          setUndos={controlled ? setUndos : setActionUndos}
          elementSize={elementSize}
          elementColor={elementColor}
          erasing={erasing}
          textMode={inTextMode}
          disabled={type === 'readonly'}
          theme={{
            baseStrokeSize: editorDefaults.minStrokeSize,
            strokeSizeDelta:
              (editorDefaults.maxStrokeSize - editorDefaults.minStrokeSize) /
              editorDefaults.numSteps,
            baseTextSize: editorDefaults.minTextSize,
            textSizeDelta:
              (editorDefaults.maxTextSize - editorDefaults.minTextSize) /
              editorDefaults.numSteps,
            eraserColor: editorDefaults.eraserColor,
            background: editorDefaults.eraserColor,
          }}
        />
      </div>
      {type === 'readonly' ? null : (
        <div
          className={styles.controls}
          style={{
            borderLeft: theme?.sidebar?.border || undefined,
            backgroundColor: theme?.sidebar?.background,
          }}
        >
          <div className={styles.controlLabel}>Text</div>
          <button
            className={styles.control}
            data-toggled={inTextMode ? 'true' : 'false'}
            onClick={() => setInTextMode(prev => !prev)}
          >
            <MdTextFields />
          </button>
          <div className={styles.controlLabel}>Eraser</div>
          <button
            className={styles.control}
            data-toggled={erasing ? 'true' : 'false'}
            onClick={() => setErasing(prev => !prev)}
          >
            <RiEraserFill />
          </button>
          <div className={styles.controlLabel}>Clear</div>
          <button className={styles.control} onClick={() => clearCanvas()}>
            <IoMdTrash />
          </button>
          <div className={styles.controlLabel}>Color</div>
          <Popover
            isOpen={colorSelectOpen}
            positions={['left']}
            padding={10}
            content={
              <div
                className={styles.colorSelect}
                style={{ backgroundColor: theme?.sidebar?.background }}
              >
                <HexColorPicker
                  style={{ width: '100%', height: '100%' }}
                  color={elementColor}
                  onChange={setElementColor}
                />
              </div>
            }
          >
            <button
              className={styles.control}
              onClick={() => setColorSelectOpen(prev => !prev)}
            >
              <div className={styles.colorWheel} />
            </button>
          </Popover>
          <div className={styles.controlLabel}>Size</div>
          <div className={styles.control} data-type="number">
            {elementSize}
          </div>
          <button
            className={styles.control}
            style={{ marginBottom: '0.25rem' }}
            onClick={() =>
              setElementSize(prev =>
                Math.min(editorDefaults.numSteps, prev + 1)
              )
            }
          >
            <RiAddFill />
          </button>
          <button
            className={styles.control}
            onClick={() => setElementSize(prev => Math.max(1, prev - 1))}
          >
            <RiSubtractFill />
          </button>
          <div className={styles.controlLabel}>Undo</div>
          <button
            className={styles.control}
            style={{ marginBottom: '0.25rem' }}
            onClick={() => undo()}
            disabled={controlled ? value.length === 0 : actions.length === 0}
          >
            <IoIosUndo />
          </button>
          <button
            className={styles.control}
            style={{ marginBottom: 0 }}
            onClick={() => redo()}
            disabled={
              controlled ? undos.length === 0 : actionUndos.length === 0
            }
          >
            <IoIosRedo />
          </button>
        </div>
      )}
    </div>
  );
};

interface CanvasProps {
  value: CanvasAction[];
  setValue: Dispatch<SetStateAction<CanvasAction[]>>;
  setUndos: Dispatch<SetStateAction<CanvasAction[]>>;
  elementSize: number;
  elementColor: string; // hex
  erasing: boolean;
  textMode: boolean;
  disabled: boolean;
  theme: {
    baseStrokeSize: number;
    strokeSizeDelta: number;
    baseTextSize: number;
    textSizeDelta: number;
    eraserColor: string;
    background: string;
  };
}

const Canvas = ({
  value,
  setValue,
  setUndos,
  elementSize,
  elementColor,
  erasing,
  textMode,
  disabled,
  theme,
}: CanvasProps) => {
  const SCALE_FACTOR = 1;

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // handle resizing
  useEffect(() => {
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    const observer = new ResizeObserver(() => {
      if (wrapper.offsetWidth !== width) {
        setWidth(wrapper.offsetWidth);
      }
      if (wrapper.offsetHeight !== height) {
        setHeight(wrapper.offsetHeight);
      }
    });

    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const { lines, text } = computeCanvasValue(value);
    setTextElements(text);
    reconstructCanvas(lines);
  }, [width, height]);

  // handle drawing
  useEffect(() => {
    const determineStrokeStyle = () => {
      if (erasing) return theme.eraserColor;
      return elementColor;
    };

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    let line: Line = { color: '', width: 0, points: [] };

    const startDrawing = (e: MouseEvent) => {
      if (textMode) {
        return;
      }

      isDrawing = true;
      lastX = e.offsetX;
      lastY = e.offsetY;

      line.points.push([lastX, lastY]);
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing || textMode) {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = determineStrokeStyle();
      ctx.lineWidth =
        theme.baseStrokeSize + elementSize * theme.strokeSizeDelta;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      line.color = ctx.strokeStyle;
      line.width = theme.baseStrokeSize + elementSize * theme.strokeSizeDelta;

      const xTo = e.offsetX / SCALE_FACTOR;
      const yTo = e.offsetY / SCALE_FACTOR;

      line.points.push([xTo, yTo]);

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(xTo, yTo);
      ctx.stroke();

      lastX = xTo;
      lastY = yTo;
    };

    const stopDrawing = () => {
      isDrawing = false;

      if (line.points.length >= 2) {
        const lineCopy = line;
        setValue(prev => [
          ...prev,
          {
            type: 'drawLine',
            data: lineCopy,
          },
        ]);

        setUndos([]);
      }

      line = { color: '', width: 0, points: [] };
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [value, setValue, setUndos, elementSize, elementColor, erasing, textMode]);

  const [textElements, setTextElements] = useState<Text[]>([]);

  const textSize = theme.baseTextSize + elementSize * theme.textSizeDelta;

  // handle insert text
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleInsertText = (e: MouseEvent) => {
      if (!textMode) return;

      setValue(prev => [
        ...prev,
        {
          type: 'addText',
          data: {
            id: crypto.randomUUID(),
            color: elementColor,
            size: textSize,
            x: e.offsetX,
            y: e.offsetY,
            value: '',
          },
        },
      ]);
    };

    canvas.addEventListener('mousedown', handleInsertText);

    return () => {
      canvas.removeEventListener('mousedown', handleInsertText);
    };
  }, [textMode, elementSize, elementColor, setValue]);

  const handleEditText = (e: FormEvent<HTMLInputElement>, id: string) => {
    const elementIndex = value.findIndex(
      action => action.type === 'addText' && action.data.id === id
    );
    if (elementIndex === -1) return;

    const text = value[elementIndex];
    const valueCopy = value.slice();
    valueCopy.splice(elementIndex, 1, {
      ...text,
      data: { ...text.data, value: e.currentTarget.value },
    });
    setValue(valueCopy);
  };

  const handleTextUnfocus = (id: string) => {
    const elementIndex = value.findIndex(
      element => element.type === 'addText' && element.data.id === id
    );
    if (elementIndex === -1) return;

    const element = value[elementIndex];
    if (element.data.value.length === 0) {
      const valuesCopy = value.slice();
      valuesCopy.splice(elementIndex, 1);
      setValue(valuesCopy);
    }
  };

  // handle reconstruction
  const computeCanvasValue = (
    actions: CanvasAction[]
  ): { lines: Line[]; text: Text[] } => {
    let lines: Line[] = [];
    let text: Text[] = [];
    for (const action of actions) {
      switch (action.type) {
        case 'drawLine':
          lines.push(action.data as Line);
          break;
        case 'addText':
          text.push(action.data as Text);
          break;
        case 'clear':
          lines = [];
          text = [];
          break;
      }
    }

    return { lines, text };
  };

  const reconstructCanvas = (lines: Line[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const line of lines) {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      for (let i = 1; i < line.points.length; i++) {
        const [x1, y1] = line.points[i - 1];
        ctx.moveTo(x1, y1);

        const [x2, y2] = line.points[i];
        ctx.lineTo(x2, y2);

        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    const { lines, text } = computeCanvasValue(value);
    setTextElements(text);
    reconstructCanvas(lines);
  }, [value]);

  const latestTextInputRef = useRef<HTMLInputElement>(null);
  const [lastNumTextElements, setLastNumTextElements] = useState<number>(0);
  useEffect(() => {
    const latestInput = latestTextInputRef.current;
    if (!latestInput) return;

    const tmp = lastNumTextElements;
    setLastNumTextElements(textElements.length);
    if (textElements.length < tmp) {
      return;
    }
  }, [textElements, lastNumTextElements]);

  return (
    <div
      ref={wrapperRef}
      className={styles.canvasWrapper}
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        backgroundColor: theme.background,
      }}
    >
      <div className={styles.textElements}>
        {textElements.map((text, i) => (
          <div
            key={text.id}
            className={styles.textResizeWrapper}
            style={{
              top: text.y,
              left: text.x,
              pointerEvents: textMode ? 'auto' : 'none',
            }}
          >
            <span
              className={styles.sizeControl}
              style={{ fontSize: text.size, backgroundColor: 'red' }}
            >
              {text.value}
            </span>
            <input
              className={styles.textElement}
              style={{
                minHeight: text.value ? text.size + 10 : textSize + 10,
                color: text.color,
                fontSize: text.size,
              }}
              value={text.value}
              onInput={e => handleEditText(e, text.id)}
              onBlur={() => handleTextUnfocus(text.id)}
              onClick={console.log}
              spellCheck="false"
              autoCorrect="off"
              autoFocus={textMode ? true : false}
            />
          </div>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        data-mode={textMode ? 'type' : 'draw'}
        width={width}
        height={height}
      />
    </div>
  );
};
