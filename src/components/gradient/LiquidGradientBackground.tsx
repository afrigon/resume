import { CSSProperties } from "react"
import * as x3d from "x3d"
import { ManagedCanvas3d } from "x3d-react"
import { LiquidGradientShader } from "./LiquidGradientShader"
import { LiquidGradientMaterial } from "./LiquidGradientMaterial"

interface LiquidGradientBackgroundProps {
    className?: string
    style?: CSSProperties
}

class Test extends x3d.Geometry {
    constructor() {
        super()

        this.vertices = [
            -1, -1, 0, 
            -1, 1, 0,
            1, 1, 0,
            1, -1, 0,
        ]

        this.normals = [
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1
        ]

        this.uvs = [
            0, 0,
            0, 0,
            0, 0,
            0, 0
        ]

        this.indices = [
            0, 1, 2,
            0, 2, 3
        ]
    }
}

export default function LiquidGradientBackground({ className, style }: LiquidGradientBackgroundProps) {
    const scene = new x3d.GameScene("liquid-gradient")
    const camera = new x3d.MainCamera()

    function onInit(renderer: x3d.SceneRenderer) {
        renderer.registerShader(new LiquidGradientShader())

        const mainCamera = new x3d.GameObject("main-camera")
        // camera.projection = x3d.OrthographicProjection.fromScreen(renderer.width, renderer.height, -2000, 2000)
        camera.projection = new x3d.PerspectiveProjection(x3d.Angle.degrees(90), 16 / 9, -1000, 1000)
        mainCamera.transform.position = new x3d.Vector3(0, 0, -10)
        mainCamera.addComponent(camera)
        scene.root.addChild(mainCamera)

        const plane = new x3d.GameObject("plane")
        // const geometry = new x3d.PlaneGeometry(
        //     renderer.width, 
        //     renderer.height, 
        //     Math.ceil(renderer.width * 0.06), 
        //     Math.ceil(renderer.height * 0.16)
        // )

        const geometry = new Test()
        renderer.registerGeometry(geometry)
        const material = new LiquidGradientMaterial({ wireframe: false, color: x3d.Color.red })

        plane.addComponent(new x3d.MeshRenderer(geometry.id, material))
        scene.root.addChild(plane)
    }

    function onResize(renderer: x3d.SceneRenderer) {
        camera.backgroundColor = x3d.Color.blue
        // TODO: handle resize later

        // TODO: deallocate old geometry

        // camera.projection = x3d.OrthographicProjection.fromScreen(renderer.width, renderer.height, -2000, 2000)

        // const geometry = new x3d.PlaneGeometry(
        //     renderer.width, 
        //     renderer.height, 
        //     Math.ceil(renderer.width * 0.06), 
        //     Math.ceil(renderer.height * 0.16)
        // )

    }

    function onDraw(renderer: x3d.SceneRenderer, now: number) {
        // TODO: update scene

        renderer.draw(scene)
    }

    return <ManagedCanvas3d onInit={onInit} onResize={onResize} onDraw={onDraw} className={className} style={style} />
}
