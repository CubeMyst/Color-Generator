import { useState, useEffect, useRef, useCallback } from "react";
import randomcolor from "randomcolor";
import "./App.css";

function App(): JSX.Element {
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [contrastColor, setContrastColor] = useState<string>("#FFFFFF");
  const hexRef = useRef<HTMLInputElement>(null);

  interface HSL {
    hue: number;
    saturation: number;
    lightness: number;
  }

  const getContrastColor = useCallback((hexColor: string): '#FFFFFF' | '#000000' => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
      throw new Error(`Invalid hex color value: ${hexColor}`);
    }

    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const hsl = rgbToHsl(r, g, b);
    const luminance: number = hsl.lightness || 0;

    return luminance < 0.5 ? "#FFFFFF" : "#000000";
  }, []);

  const rgbToHsl = useCallback((r: number, g: number, b: number): HSL => {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const maxValue = Math.max(red, green, blue);
    const minValue = Math.min(red, green, blue);

    let hue = 0;
    let saturation = 0;
    const lightness = (maxValue + minValue) / 2;

    if (maxValue !== minValue) {
      const delta = maxValue - minValue;
      saturation = lightness > 0.5 ? delta / (2 - maxValue - minValue) : delta / (maxValue + minValue);

      switch (maxValue) {
        case red:
          hue = (green - blue) / delta + (green < blue ? 6 : 0);
          break;
        case green:
          hue = (blue - red) / delta + 2;
          break;
        case blue:
          hue = (red - green) / delta + 4;
          break;
      }
      hue /= 6;
    }

    return { hue, saturation, lightness };
  }, []);

  useEffect(() => {
    const contrast = getContrastColor(currentColor);
    setContrastColor(contrast);
  }, [currentColor, getContrastColor]);

  // Genera un nuevo color aleatorio y lo establece como el color actual
  const handleGenerateColor = useCallback((): void => {
    const randomColor: string = randomcolor();
    setCurrentColor(randomColor);
  }, [])

  const handleCopyHex = useCallback((): void => {
    navigator.clipboard.writeText(currentColor);
    hexRef.current?.focus();
    hexRef.current?.select();

    if (hexRef.current) {
    hexRef.current.select();

    if (Notification && (Notification.permission === 'granted' || Notification.permission === undefined)) {
      console.log('Color copiado correctamente!');
    } else {
      console.log('La notificación está desactivada.');
    }

    document.execCommand('copy');
  }
  }, [currentColor]);

  const inputStyles: React.CSSProperties = {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "600",
    border: "none",
    background: "transparent",
    color: getContrastColor(currentColor),
    cursor: "pointer",
  }

  const borderColor = currentColor
  const transition = 'border-color 0.1s ease-in-out'

  const buttonStyles: React.CSSProperties = {
    border: `1px solid ${borderColor}`,
    transition: transition,
    cursor: 'pointer'
  }

  return (
    <div className="App">
      <h1>Generador de color aleatorio</h1>
      <div data-testid='color__box' className="color__box" style={{ backgroundColor: currentColor }}>
        <p style={{ color: contrastColor }}>
          <input
            data-testid="color-input"
            ref={hexRef}
            type="text"
            value={currentColor.toUpperCase()}
            readOnly
            style={inputStyles}
            onClick={handleCopyHex}
          />
        </p>
      </div>
      <button
        data-testid="generate-color-button"
        onClick={handleGenerateColor}
        style={buttonStyles}
      >
        Generar color
      </button>
    </div>
  );
}

export default App;
