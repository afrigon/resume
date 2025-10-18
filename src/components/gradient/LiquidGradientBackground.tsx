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
            // back  (-Z)
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,

            // front (+Z)
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,

            // left  (-X)
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,

            // right (+X)
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,

            // bottom (-Y)
            -0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,

            // top    (+Y)
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
        ]

        this.normals = [
            // back
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            // front
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            // left
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            // right
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            // bottom
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            // top
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        ]

        this.uvs = [
            // each face: (0,0) (0,1) (1,1) (1,0)
            0, 0, 0, 1, 1, 1, 1, 0,  // back
            0, 0, 0, 1, 1, 1, 1, 0,  // front
            0, 0, 0, 1, 1, 1, 1, 0,  // left
            0, 0, 0, 1, 1, 1, 1, 0,  // right
            0, 0, 0, 1, 1, 1, 1, 0,  // bottom
            0, 0, 0, 1, 1, 1, 1, 0,  // top
        ]

        this.indices = [
            // back
            0, 1, 2, 0, 2, 3,
            // front
            4, 5, 6, 4, 6, 7,
            // left
            8, 9, 10, 8, 10, 11,
            // right
            12, 13, 14, 12, 14, 15,
            // bottom
            16, 17, 18, 16, 18, 19,
            // top
            20, 21, 22, 20, 22, 23,
        ]

    }
}

export default function LiquidGradientBackground({ className, style }: LiquidGradientBackgroundProps) {
    const scene = new x3d.GameScene("liquid-gradient")
    const camera = new x3d.MainCamera()
    const plane = new x3d.GameObject("plane")

    function onInit(renderer: x3d.SceneRenderer) {
        renderer.registerShader(new LiquidGradientShader())

        const mainCamera = new x3d.GameObject("main-camera")
        // camera.projection = x3d.OrthographicProjection.fromScreen(renderer.width, renderer.height, -2000, 2000)
        camera.projection = new x3d.PerspectiveProjection(x3d.Angle.degrees(90), 16 / 9, 0.01, 1000)
        mainCamera.transform.position = new x3d.Vector3(0, -100, 0)
        mainCamera.addComponent(camera)
        scene.root.addChild(mainCamera)

        plane.transform.position = new x3d.Vector3(0, 0, 500)
        const geometry = new x3d.PlaneGeometry(
            renderer.width, 
            renderer.height, 
            Math.ceil(renderer.width * 0.06), 
            Math.ceil(renderer.height * 0.16)
        )

        // const geometry = new Test()
        renderer.registerGeometry(geometry)
        const material = new LiquidGradientMaterial({ 
            wireframe: false, 
            color1: x3d.Color.rgb(169, 96, 238),
            color2: x3d.Color.rgb(255, 51, 61),
            color3: x3d.Color.rgb(144, 224, 255),
            color4: x3d.Color.rgb(255, 202, 87)
        })

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
