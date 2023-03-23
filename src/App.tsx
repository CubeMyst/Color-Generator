import { useState, useEffect, useRef } from 'react';
import randomcolor from 'randomcolor';
import './App.css';

function App() {
  const [currentColor, setCurrentColor] = useState('#000000');
  const [contrastColor, setContrastColor] = useState('#FFFFFF');
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const hexRef = useRef(null);

  useEffect(() => {
    function getContrastColor(hexColor: String) {
      const r = parseInt(hexColor.slice(1, 2), 16);
      const g = parseInt(hexColor.slice(2, 4), 16);
      const b = parseInt(hexColor.slice(4, 6), 16);

      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    const contrast= getContrastColor(currentColor);
    setContrastColor(contrast);
  }, [currentColor]);

  function handleGenerateColor() {
    const color = randomcolor();
    setCurrentColor(color);
  }

  function handleCopyHex() {
    navigator.clipboard.writeText(currentColor);
    // @ts-ignore
    hexRef.current.focus();
    // @ts-ignore
    hexRef.current.select();
  }

  return (
    <div className="App">
      <h1>Generador de colores</h1>
      <div className="color__box" style={{ backgroundColor: currentColor }}>
        <p style={{color: contrastColor}}>
          <input
            ref={hexRef}
            type='text'
            value={currentColor.toUpperCase()}
            readOnly
            style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: '600',
              fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
              border: 'none',
              background: 'transparent',
              color: contrastColor,
              cursor: 'pointer'
            }}
            onClick={handleCopyHex}
          />
        </p>
      </div>
      <button
        onClick={handleGenerateColor}
        onMouseEnter={() => setHoverColor(currentColor)}
        onMouseLeave={() => setHoverColor(null)}
        style={{
          border: `1px solid ${hoverColor || currentColor}`,
          transition: 'border-color 0.1s ease-in-out',
          cursor: 'pointer'
        }}>
          generar
      </button>
    </div>
  )
}

export default App
