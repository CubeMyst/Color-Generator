import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("renders title", () => {
    render(<App />);
    const title = screen.getByText(/Generador de color aleatorio/i);
    expect(title).toBeInTheDocument();
  });

  test("changes color on button click", () => {
    render(<App />);
    const generateButton = screen.getByText(/Generar color/i);
    const colorBox = screen.getByTestId("color__box");
    // Get initial color
    const initialColor = colorBox.style.backgroundColor;
    // Click button to generate new color
    fireEvent.click(generateButton);
    // Get new color
    const newColor = colorBox.style.backgroundColor;
    // Check that the color has changed
    expect(newColor).not.toEqual(initialColor);
  });
});
