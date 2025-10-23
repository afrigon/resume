import video from "./assets/roadrunner.mp4"

export function RoadrunnerShowcase() {
    return (
        <video className="rounded-2xl border-white border-6 max-tiny:border-2 shadow-2xl" src={video} autoPlay={true} muted={true} controls={false} loop={true} playsInline={true}></video>
    )
}
