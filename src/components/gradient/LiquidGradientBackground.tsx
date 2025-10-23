import { CSSProperties, useRef } from "react"
import * as x3d from "x3d"
import { ManagedCanvas3d } from "x3d-react"
import { LiquidGradientShader } from "./LiquidGradientShader"
import { LiquidGradientMaterial } from "./LiquidGradientMaterial"

interface LiquidGradientBackgroundProps {
    colors: x3d.Color[]
    className?: string
    style?: CSSProperties
}

const stripe = [
    x3d.Color.rgb(169, 96, 238),
    x3d.Color.rgb(255, 51, 61),
    x3d.Color.rgb(144, 224, 255),
    x3d.Color.rgb(255, 202, 87)
]

export default function LiquidGradientBackground({ 
    colors,
    className, 
    style
}: LiquidGradientBackgroundProps) {
    const ref = useRef({
        scene: new x3d.GameScene("liquid-gradient"),
        camera: new x3d.MainCamera(),
        plane: new x3d.GameObject("plane")
    })

    function onInit(renderer: x3d.SceneRenderer) {
        renderer.registerShader(new LiquidGradientShader())

        const mainCamera = new x3d.GameObject("main-camera")
        ref.current.camera.projection = x3d.OrthographicProjection.fromScreen(renderer.width, renderer.height, -2000, 2000)
        mainCamera.addComponent(ref.current.camera)
        ref.current.scene.root.addChild(mainCamera)

        const geometry = new x3d.PlaneGeometry(
            renderer.width, 
            renderer.height, 
            Math.ceil(renderer.width * 0.06), 
            Math.ceil(renderer.height * 0.16)
        )

        renderer.registerGeometry(geometry)
        const material = new LiquidGradientMaterial({ 
            wireframe: false, 
            colors: colors,
            seed: 5
        })

        ref.current.plane.addComponent(new x3d.MeshRenderer(geometry.id, material))
        ref.current.scene.root.addChild(ref.current.plane)
    }

    function onResize(renderer: x3d.SceneRenderer) {
        renderer.deleteGeometry()

        ref.current.camera.projection = x3d.OrthographicProjection.fromScreen(renderer.width, renderer.height, -2000, 2000)

        const geometry = new x3d.PlaneGeometry(
            renderer.width, 
            renderer.height, 
            Math.ceil(renderer.width * 0.06), 
            Math.ceil(renderer.height * 0.16)
        )
        renderer.registerGeometry(geometry)
        const mesh = ref.current.plane.getComponent("mesh-renderer") as x3d.MeshRenderer
        mesh.geometry = geometry.id
    }

    function onDraw(renderer: x3d.SceneRenderer, input: x3d.Input, delta: number) {
        ref.current.scene.update(input, delta)
        renderer.draw(ref.current.scene)
    }

    function cssColor(color: x3d.Color, alpha?: number): string {
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha ?? color.a})`
    }

    const fallback = {
        background: `
            radial-gradient(
                ${cssColor(colors[0])} 40%, 
                ${cssColor(colors[2], 0)} 60%
            ) -620px -180px no-repeat, 
            radial-gradient(
                ${cssColor(colors[3])} 33%, 
                ${cssColor(colors[3], 0)} 67%
            ) -120px -24px no-repeat, 
            radial-gradient(
                ${cssColor(colors[2])} 40%, 
                ${cssColor(colors[2], 0)} 70%
            ) -470px 150px no-repeat, 
            ${cssColor(colors[0])}
        `
    }

    return <ManagedCanvas3d 
        onInit={onInit} 
        onResize={onResize} 
        onDraw={onDraw} 
        locksCursor={false} 
        className={className} 
        style={{
            ...style,
            ...fallback
        }} 
    />
}
