import { useState, useLayoutEffect, useEffect, useCallback, useRef, RefObject } from "react"

class Geometry {
    x: number
    y: number
    width: number
    height: number

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    static zero(): Geometry {
        return new Geometry(0, 0, 0, 0)
    }
}

export default function useGeometryReader<T extends HTMLElement = HTMLDivElement>(): [RefObject<T | null>, Geometry] {
    const [geometry, setGeometry] = useState(Geometry.zero())
    const ref: RefObject<T | null> = useRef(null)

    const queryGeometry = useCallback(() => {
        const element = ref?.current

        if (!element) {
            return
        }

        setGeometry(new Geometry(element.clientLeft, element.clientTop, element.clientWidth, element.clientHeight))
    }, [ref])

    const hook = typeof window !== "undefined" ? useLayoutEffect : useEffect

    hook(() => {
        const element = ref?.current

        if (!element) {
            return
        }

        queryGeometry()

        const observer = new ResizeObserver(queryGeometry)
        observer.observe(element)

        return () => observer.disconnect()
    }, [ref, queryGeometry])

    return [ref, geometry]
}
