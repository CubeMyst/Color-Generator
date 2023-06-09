import React, { useRef } from 'react';

export default function ColorBox({
	currentColor,
	contrastColor,
	colorNameValue,
	fontColor,
	handleCopyHex,
}) {
	const colorInputRef = useRef(null);

	const handleCopy = () => {
		navigator.clipboard.writeText(currentColor);
		colorInputRef?.current.focus();
		colorInputRef?.current.select();

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
	};

	const buttonBorder = {
		border: `1px solid ${currentColor}`,
	};

	return (
		<div
			data-testid='color__box'
			className='color__box'
			style={{ backgroundColor: currentColor }}>
			<label
				htmlFor='color-input'
				style={fontColor}>
				{colorNameValue}
			</label>
			<p style={{ color: contrastColor }}>
				<input
					type='text'
					data-testid='color-input'
					ref={colorInputRef}
					value={currentColor.toUpperCase()}
					style={fontColor}
					onClick={handleCopy}
					readOnly
				/>
			</p>
			<button
				data-testid='generate-color-button'
				onClick={handleCopyHex}
				style={buttonBorder}>
				Generar color
			</button>
		</div>
	);
}
