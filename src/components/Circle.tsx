import { useRef, useEffect, RefObject } from "react"

export interface CircleProps {
    size: number
    color: string
}

export default function Circle(props: CircleProps) {
    const canvasRef: RefObject<HTMLCanvasElement | null> = useRef(null)
    const { size } = props

    useEffect(() => {
        const draw = (context: CanvasRenderingContext2D) => {
            context.fillStyle = props.color || "#000000"
            // context.strokeStyle = null;
            context.beginPath()
            context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
            context.fill()
        }

        const canvas = canvasRef.current

        if (canvas) {
            const context = canvas.getContext("2d")

            if (context) {
                draw(context)
            }
        }
    })

    return <canvas className="unselectable" width={size} height={size} ref={canvasRef} {...props} />
}

