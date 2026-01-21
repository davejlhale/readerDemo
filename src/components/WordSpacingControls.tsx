interface WordSpacingControlsProps {
  wordSpacing: number;
  setWordSpacing: React.Dispatch<React.SetStateAction<number>>;
}

export function WordSpacingControls({
  wordSpacing,
  setWordSpacing
}: WordSpacingControlsProps) {
  const decrease = () => setWordSpacing(w => Math.max(0, w - 0.05));
  const increase = () => setWordSpacing(w => Math.min(5, w + 0.05));

  return (
    <div className="word-spacing-controls">
      <button onClick={decrease}>WS−</button>
      <button onClick={increase}>WS+</button>
    </div>
  );
}