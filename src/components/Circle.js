import React, { useRef, useEffect } from 'react'

export default function Circle(props) {
    const canvasRef = useRef(null)
    const { size } = props

    useEffect(() => {
        const draw = ctx => {
            ctx.fillStyle = props.color || '#000000'
            ctx.strokeStyle = null;
            ctx.beginPath()
            ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
            ctx.fill()
        }

        const canvas = canvasRef.current
        draw(canvas.getContext('2d'))
    })

    return <canvas className="unselectable" width={size} height={size} ref={canvasRef} {...props} />
}

