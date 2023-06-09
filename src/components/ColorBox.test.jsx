import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorBox from './ColorBox';

describe('ColorBox', () => {
	test('renders ColorBox component with correct values', () => {
		// Arrange
		const currentColor = '#FF0000';
		const contrastColor = '#FFFFFF';
		const colorNameValue = 'Red';
		const fontColor = {
			color: '#FFFFFF',
		};
		const handleCopyHex = jest.fn();

		// Act
		render(
			<ColorBox
				currentColor={currentColor}
				contrastColor={contrastColor}
				colorNameValue={colorNameValue}
				fontColor={fontColor}
				handleCopyHex={handleCopyHex}
			/>
		);

		// Assert
		const colorBox = screen.getByTestId('color__box');
		const colorInput = screen.getByTestId('color-input');
		const generateColorButton = screen.getByTestId('generate-color-button');

		expect(colorBox).toBeInTheDocument();
		expect(colorBox).toHaveStyle({ backgroundColor: currentColor });
		expect(screen.getByText(colorNameValue)).toBeInTheDocument();
		expect(colorInput).toHaveValue(currentColor.toUpperCase());
	});

	test('calls handleCopyHex when generate color button is clicked', () => {
		// Arrange
		const currentColor = '#FF0000';
		const contrastColor = '#FFFFFF';
		const colorNameValue = 'Red';
		const fontColor = {
			color: '#FFFFFF',
		};
		const handleCopyHex = jest.fn();

		render(
			<ColorBox
				currentColor={currentColor}
				contrastColor={contrastColor}
				colorNameValue={colorNameValue}
				fontColor={fontColor}
				handleCopyHex={handleCopyHex}
			/>
		);

		const generateColorButton = screen.getByTestId('generate-color-button');

		// Act
		fireEvent.click(generateColorButton);

		// Assert
		expect(handleCopyHex).toHaveBeenCalledTimes(1);
	});
});
