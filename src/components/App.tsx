import Introduction from "./Introduction"
import ProjectCollectionView from "./projects/ProjectCollectionView"

export default function App() {
    return (
        <div>
            <Introduction />

            <div className="bg-gray-100 w-full grid justify-center max-desktop:py-16">
                <div className="max-w-[1080px]">
                    <ProjectCollectionView />
                </div>
            </div>
        </div>
    )
}
