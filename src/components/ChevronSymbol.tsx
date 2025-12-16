import { motion } from "motion/react"

interface ChevronSymbolProps {
    hovered: boolean
}

export default function ChevronSymbol({ hovered }: ChevronSymbolProps) {
    return (
        <svg
            className="inline fill-none stroke-2 stroke-white"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            aria-hidden="true"
        >
            <g fillRule="evenodd">
                <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    d="M0 5h7"
                />

                <motion.path animate={{ x: hovered ? 3 : 0 }} transition={{ duration: 0.15 }} d="M1 1l4 4-4 4" />
            </g>
        </svg>
    )
}
