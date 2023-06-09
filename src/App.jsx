import React, { useState, useEffect, useCallback } from 'react';
import randomcolor from 'randomcolor';
import convert from 'color-convert';
import ColorBox from './components/ColorBox';

export default function App() {
	const [currentColor, setCurrentColor] = useState('#000000');
	const [contrastColor, setContrastColor] = useState('#FFFFFF');
	const colorNameValue = convert.hex.keyword(currentColor);

	const rgbToHsl = useCallback(
		/**
		 * Convierte un color en formato RGB a formato HSL.
		 * @param {number} r - Valor de rojo en el rango [0, 255].
		 * @param {number} g - Valor de verde en el rango [0, 255].
		 * @param {number} b - Valor de azul en el rango [0, 255].
		 * @returns {object} - Objeto con las propiedades hue, saturation y lightness.
		 */
		(r, g, b) => {
			// Conversión de los valores RGB al rango [0, 1]
			const [red, green, blue] = [r / 255, g / 255, b / 255];

			// Obtención del valor máximo y mínimo de los componentes RGB
			const maxValue = Math.max(red, green, blue);
			const minValue = Math.min(red, green, blue);

			let hue = 0;
			let saturation = 0;
			const lightness = (maxValue + minValue) / 2;

			// Cálculo del matiz
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

			// Devuelve un objeto con las propiedades hue, saturation y lightness en formato HSL
			return { hue, saturation, lightness };
		},
		[]
	);

	const getContrastColor = useCallback(
		/**
		 * Calcula el color de contraste en base a un color hexadecimal.
		 * @param {string} hexColor - Color hexadecimal en formato "#RRGGBB".
		 * @returns {string} - Color de contraste en formato "#RRGGBB".
		 * @throws {Error} - Si el valor del color hexadecimal es inválido.
		 */
		(hexColor) => {
			// Comprobación de validez del color hexadecimal
			const isValidHexColor = !/^#[0-9A-Fa-f]{6}$/.test(hexColor);
			if (isValidHexColor) {
				throw new Error(`Invalid hex color value: ${hexColor}`);
			}

			// Conversión del color hexadecimal a valores RGB
			const [r, g, b] = [
				parseInt(hexColor.slice(1, 3), 16),
				parseInt(hexColor.slice(3, 5), 16),
				parseInt(hexColor.slice(5, 7), 16),
			];

			// Conversión de RGB a HSL para obtener la luminosidad
			const hsl = rgbToHsl(r, g, b);
			const luminance = hsl.lightness || 0;

			// Determinación del color de contraste en base a la luminosidad
			return luminance < 0.5 ? '#FFFFFF' : '#000000';
		},
		// Se incluye `rgbToHsl` como dependencia para asegurar que cualquier cambio en la función se refleje en esta función
		[rgbToHsl]
	);

	const handleGenerateColor = useCallback(
		/**
		 * Genera un color aleatorio y actualiza el estado de `currentColor` con el nuevo color.
		 */
		() => {
			// Genera un color aleatorio utilizando la librería randomcolor
			const randomColor = randomcolor();
			// Actualiza el estado de `currentColor` con el nuevo color generado
			setCurrentColor(randomColor);
		},
		[]
	);

	useEffect(() => {
		const contrast = getContrastColor(currentColor);
		setContrastColor(contrast);
	}, [currentColor, getContrastColor]);

	const fontColor = {
		color: getContrastColor(currentColor),
	};

	return (
		<div className='App'>
			<h1>Generador de color aleatorio</h1>
			<div className='generate'>
				<ColorBox
					currentColor={currentColor}
					contrastColor={contrastColor}
					colorNameValue={colorNameValue}
					fontColor={fontColor}
					handleCopyHex={handleGenerateColor}
				/>
			</div>
		</div>
	);
}
