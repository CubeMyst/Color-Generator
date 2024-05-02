import { useState } from "react";
import { random } from "uniqolor";
import { name } from "colors-convert"

export default function useRandomColor() {
  const [currentColor, setCurrentColor] = useState(random().color);
  const [contrastColor, setContrastColor] = useState(random().isLight ? "#FFFFFF" : "#000000");

  const nameColor = name(currentColor)

  function getContrast(isLight: boolean) {
    return isLight ? "#FFFFFF" :  "#000000"
  }

  function updateColor() {
    const color = random()
    setCurrentColor(color.color)
    const contrast = getContrast(color.isLight)
    setContrastColor(contrast)
  }

  const color = contrastColor

  return {
    currentColor,
    setCurrentColor,
    contrastColor,
    updateColor,
    nameColor,
    color
  }
}
