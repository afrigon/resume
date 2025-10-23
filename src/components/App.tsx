import LiquidGradientBackground from "./gradient/LiquidGradientBackground"
import ProjectCollectionView from "./projects/ProjectCollectionView"
import { Color } from "x3d"

export default function App() {
    return (
        <div>
            <div className="flex justify-center">
                <LiquidGradientBackground 
                    colors={[
                        Color.string("#c3e4ff"),
                        Color.string("#6ec3f4"),
                        Color.string("#eae2ff"),
                        Color.string("#b9beff")
                    ]} 
                    className="w-full h-160 max-h-screen absolute top-0 left-0 z-0"
                />

                <section className="px-8 max-desktop:px-4 h-160 max-h-screen max-w-[1400px] w-full relative flex justify-center flex-col">
                    <div className="relative">
                        <h1 className="absolute font-bold text-9xl max-tiny:text-3xl max-desktop:text-7xl mix-blend-color-burn">{"Hi, I'm Alex."}</h1>
                        <h1 className="font-bold text-9xl max-tiny:text-3xl max-desktop:text-7xl opacity-30">{"Hi, I'm Alex."}</h1>
                    </div>

                    <h2 className="text-4xl max-tiny:text-base text-gray-600 mt-4 max-tiny:mt-2">Software Developer</h2>
                </section>
            </div>


            <div className="bg-gray-100 w-full grid justify-center max-desktop:py-16">
                <div className="max-w-[1080px]">
                    <ProjectCollectionView />
                </div>
            </div>
        </div>
    )
}
