import React, { useRef } from 'react'
import useColorContrast from '../hooks/useColorContrast'
import convert from 'color-convert'

export default function ColorBox() {
  const { currentColor, contrastColor, fontColor, handleGenerateColor } =
		useColorContrast()
  const colorNameValue = convert.hex.keyword(currentColor)
  const colorInputRef = useRef(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(currentColor)
    colorInputRef?.current.focus()
    colorInputRef?.current.select()

    if (
      window.Notification &&
			(window.Notification.permission === 'granted' ||
				window.Notification.permission === undefined)
    ) {
      console.log('Color copiado correctamente!')
    } else {
      console.log('La notificación está desactivada.')
    }

    document.execCommand('copy')
  };

  // const buttonBorder = {
  //   border: `1px solid ${currentColor}`
  // }

  return (
		<div
			data-testid='color__box'
			className='color__box'
			style={{ backgroundColor: currentColor }}>
			<form
				style={{ color: contrastColor }}
				onSubmit={(e) => handleGenerateColor(e)}>
				<input
					type='text'
					data-testid='color-input'
					ref={colorInputRef}
					value={currentColor.toUpperCase()}
					style={fontColor}
					onClick={handleCopy}
					readOnly
				/>
				<label
					htmlFor='color-input'
					style={fontColor}>
					{colorNameValue}
				</label>
				<button
					type='submit'
					onClick={handleGenerateColor}>
					Generar color
				</button>
			</form>
		</div>
  )
}
