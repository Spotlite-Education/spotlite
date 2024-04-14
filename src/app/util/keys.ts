import { KeyboardEvent } from 'react';

export const isUndo = (e: KeyboardEvent) => {
  return (e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey;
};

export const isRedo = (e: KeyboardEvent) => {
  return (
    ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
    ((e.ctrlKey || e.metaKey) && e.key === 'y')
  );
};
