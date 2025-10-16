import LiquidGradientBackground from "./gradient/LiquidGradientBackground"
import ProjectCollectionView from "./projects/ProjectCollectionView"

export default function App() {
    return (
        <div className="text-gray-900">
            <div>
                <LiquidGradientBackground className="w-full h-160 absolute top-0 left-0 -z-10" />

                <section className="px-4 h-160">
                    <h1 className="font-bold text-7xl text-gray-200">{"Hi I'm Alex."}</h1>
                </section>
            </div>


            <div className="bg-gray-100 w-full grid justify-center">
                <div className="max-w-[1080px]">
                    <ProjectCollectionView />
                </div>
            </div>
        </div>
    )
}
