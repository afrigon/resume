import { Project } from "./ProjectView"
import iconXemu from "./icons/xemu.png"
import iconRoadrunner from "./icons/roadrunner.png"
import { RoadrunnerShowcase } from "./showcase/RoadrunnerShowcase"

const xemu: Project = {
    id: "xemu",
    title: "xemu",
    subtitle: "NES Emulator",
    description:
        "Built a cycle-accurate NES emulator for iOS, macOS and tvOS using Swift and the Metal API. Features a debugger, a game library with thumbnail generation and audio emulation.",
    icon: iconXemu,
    cta: {
        text: "Browse on Github",
        link: "https://github.com/afrigon/xemu",
        type: "github"
    },
    extras: [
        {
            title: "Swiftness",
            description: "non cycle-accurate version",
            link: "https://github.com/afrigon/swiftness"
        },
        {
            title: "ines-cli",
            description: "command line interface for the iNes file format",
            link: "https://github.com/afrigon/ines-cli"
        }
    ],
    artwork: () => RoadrunnerShowcase()
}

const roadrunner: Project = {
    id: "roadrunner",
    title: "Roadrunner",
    subtitle: "Voxel sandbox game",
    description:
        "Wrote a Minecraft-like game with multiplayer support using Rust and OpenGL. Features a multithreaded Perlin noise world generator.",
    icon: iconRoadrunner,
    cta: {
        text: "Browse on Github",
        link: "https://github.com/roadrunner-craft/core",
        type: "github"
    },
    extras: [
        {
            title: "Client",
            description: "side project with an OpenGL renderer",
            link: "https://github.com/roadrunner-craft/client"
        },
        {
            title: "Server",
            description: "side project with simple multiplayer support",
            link: "https://github.com/roadrunner-craft/server"
        },
        {
            title: "Math",
            description: "library used across the application",
            link: "https://github.com/roadrunner-craft/math"
        }
    ],
    artwork: () => RoadrunnerShowcase()
}

export default [xemu, roadrunner]
