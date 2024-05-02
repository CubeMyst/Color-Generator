import { useEffect, useRef } from "react"
import useRandomColor from "../hooks/useRandomColor"
import useScreenDetector from "../hooks/useScreenDetector"
import { toast } from 'sonner'

export default function Card() {
    const { isMobile } = useScreenDetector()
    const { currentColor, updateColor, color, nameColor } = useRandomColor()
    const colorInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.code === "Space") {
                updateColor()
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [updateColor])

    function handleClick() {
        navigator.clipboard.writeText(currentColor)

        if (!colorInputRef.current) return

        colorInputRef?.current.focus()

        document.execCommand('copy')
        toast.success('Color copiado al portapapeles')
    }

    return (
        <section className="flex flex-col justify-center items-center size-full flex-auto md:flex-1 relative" style={{ backgroundColor: currentColor }}>
            <input type="text" className="border-0 size-full text-3xl text-center uppercase font-bold leading-4 cursor-pointer focus:outline-none" style={{ backgroundColor: currentColor, color: color }} onClick={handleClick} ref={colorInputRef} value={currentColor} readOnly />
            <h3 className="text-xl text-opacity-70 pb-3 absolute top-[52%]" style={{ color: color }}>{nameColor}</h3>
            {isMobile && <button onClick={updateColor}>Generar</button>}
        </section>
    )
}
