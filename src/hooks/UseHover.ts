import { useState, useEffect, useRef, RefObject } from "react"

export default function useHover<T extends HTMLElement = HTMLDivElement>(): [RefObject<T | null>, boolean] {
    const [hovered, setHovered] = useState(false)
    const ref: RefObject<T | null> = useRef(null)

    useEffect(() => {
        const onEnter = () => setHovered(true)
        const onLeave = () => setHovered(false)
        const onFocus = () => setHovered(true)
        const onBlur = () => setHovered(false)

        const element = ref.current

        if (!element) {
            return
        }

        element.addEventListener("pointerenter", onEnter)
        element.addEventListener("pointerleave", onLeave)
        element.addEventListener("focus", onFocus, true)
        element.addEventListener("blur", onBlur, true)

        return () => {
            element.removeEventListener("pointerenter", onEnter)
            element.removeEventListener("pointerleave", onLeave)
            element.removeEventListener("focus", onFocus, true)
            element.removeEventListener("blur", onBlur, true)
        }
    })

    return [ref, hovered]
}
