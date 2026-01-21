import { useState, useEffect } from "react";

interface FontSizeControlsProps {
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

export function FontSizeControls({ fontSize, setFontSize }: FontSizeControlsProps) {
  const decrease = () => setFontSize(f => Math.max(0.8, f - 0.1));
  const increase = () => setFontSize(f => Math.min(6, f + 0.1));

  return (
    <div className="font-size-controls">
      <button onClick={decrease}>A−</button>
      <button onClick={increase}>A+</button>
    </div>
  );
}