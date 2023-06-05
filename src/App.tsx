import { useState, useEffect, useRef, useCallback } from 'react';
import randomcolor from 'randomcolor';

function App(): JSX.Element {
	const [currentColor, setCurrentColor] = useState<string>('#000000');
	const [contrastColor, setContrastColor] = useState<string>('#FFFFFF');
	const hexRef = useRef<HTMLInputElement>(null);

	interface HSL {
		hue: number;
		saturation: number;
		lightness: number;
	}

	/* `getContrastColor` is a function that takes a hex color value as a parameter and returns either
`'#FFFFFF'` (white) or `'#000000'` (black) depending on the luminance of the color. The function
first checks if the hex color value is valid using a regular expression. If it is valid, it converts
the hex color value to its RGB components and then converts those to HSL values using the `rgbToHsl`
function. It then calculates the luminance of the color and returns either white or black depending
on whether the luminance is less than or greater than 0.5. The `useCallback` hook is used to memoize
the function and prevent unnecessary re-renders. */
	const getContrastColor = useCallback(
		(hexColor: string): '#FFFFFF' | '#000000' => {
			if (!/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
				throw new Error(`Invalid hex color value: ${hexColor}`);
			}

			const r = parseInt(hexColor.slice(1, 3), 16);
			const g = parseInt(hexColor.slice(3, 5), 16);
			const b = parseInt(hexColor.slice(5, 7), 16);

			const hsl = rgbToHsl(r, g, b);
			const luminance: number = hsl.lightness || 0;

			return luminance < 0.5 ? '#FFFFFF' : '#000000';
		},
		[]
	);

	/* `rgbToHsl` is a function that takes in three numbers representing the red, green, and blue values
  of a color and returns an object with the hue, saturation, and lightness values of that color in
  the HSL color space. The function first converts the RGB values to a normalized range of 0 to 1,
  then calculates the maximum and minimum values of the three color components. It then calculates
  the lightness value as the average of the maximum and minimum values. If the maximum and minimum
  values are not equal, it calculates the saturation value based on the difference between the
  maximum and minimum values. Finally, it calculates the hue value based on the relative values of
  the red, green, and blue components. */
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
			saturation =
				lightness > 0.5
					? delta / (2 - maxValue - minValue)
					: delta / (maxValue + minValue);

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

	/* `handleGenerateColor` is a function that generates a new random color and sets it as the current
color state using the `setCurrentColor` function. It is wrapped in the `useCallback` hook to memoize
the function and prevent unnecessary re-renders. The empty dependency array `[]` passed as the
second argument to `useCallback` ensures that the function is only created once and not recreated on
every render. */
	const handleGenerateColor = useCallback((): void => {
		const randomColor: string = randomcolor();
		setCurrentColor(randomColor);
	}, []);

	/* `handleCopyHex` is a function that is called when the user clicks on the color input field. It
copies the current color value to the clipboard using the `navigator.clipboard.writeText` method,
selects the input field using the `hexRef.current?.focus()` and `hexRef.current?.select()` methods,
and then executes the copy command using `document.execCommand('copy')`. It also checks if the user
has granted permission for notifications and logs a message to the console accordingly. The function
is wrapped in the `useCallback` hook to memoize it and prevent unnecessary re-renders. The
`currentColor` state variable is included in the dependency array so that the function is re-created
if the current color changes. */
	const handleCopyHex = useCallback((): void => {
		navigator.clipboard.writeText(currentColor);
		hexRef.current?.focus();
		hexRef.current?.select();

		if (hexRef.current) {
			hexRef.current.select();

			if (
				Notification &&
				(Notification.permission === 'granted' ||
					Notification.permission === undefined)
			) {
				console.log('Color copiado correctamente!');
			} else {
				console.log('La notificación está desactivada.');
			}

			document.execCommand('copy');
		}
	}, [currentColor]);

	const inputStyles: React.CSSProperties = {
		textAlign: 'center',
		fontSize: '20px',
		fontWeight: '600',
		border: 'none',
		background: 'transparent',
		color: getContrastColor(currentColor),
		cursor: 'pointer',
	};

	const borderColor = currentColor;
	const transition = 'border-color 0.1s ease-in-out';

	const buttonStyles: React.CSSProperties = {
		border: `1px solid ${borderColor}`,
		transition: transition,
		cursor: 'pointer',
	};

	return (
		<div className='App'>
			<h1>Generador de color aleatorio</h1>
			<div
				data-testid='color__box'
				className='color__box'
				style={{ backgroundColor: currentColor }}>
				<p style={{ color: contrastColor }}>
					<input
						data-testid='color-input'
						ref={hexRef}
						type='text'
						value={currentColor.toUpperCase()}
						readOnly
						style={inputStyles}
						onClick={handleCopyHex}
					/>
				</p>
			</div>
			<button
				data-testid='generate-color-button'
				onClick={handleGenerateColor}
				style={buttonStyles}>
				Generar color
			</button>
		</div>
	);
}

export default App;
