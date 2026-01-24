import { useEffect, useState } from 'react'
import { FontSizeControls } from './FontSizeControls'
import { WordSpacingControls } from './WordSpacingControls'
import '../styles/text-panel-controls.css'

export function TextPanelControls() {
  const [fontSize, setFontSize] = useState(1.4)
  const [wordSpacing, setWordSpacing] = useState(0.1)

  /* -----------------------------------------
     CSS variable side effects (OWNED HERE)
  ----------------------------------------- */
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--reader-font-size',
      `${fontSize}rem`
    )
  }, [fontSize])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--reader-word-spacing',
      `${wordSpacing}em`
    )
  }, [wordSpacing])

  return (
    <div className="text-panel-controls">
      <FontSizeControls
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      <WordSpacingControls
        wordSpacing={wordSpacing}
        setWordSpacing={setWordSpacing}
      />
    </div>
  )
}
