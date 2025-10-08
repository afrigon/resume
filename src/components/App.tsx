import styled from "styled-components"

import Aos from "aos"
import "aos/dist/aos.css"

import Device from "../Device"
import Introduction from "./Introduction"
import Separator from "./Separator"
import Projects from "./Projects"
import Footer from "./Footer"

const Main = styled.div`
    width: 100%;
    overflow-x: hidden;
    padding: 0 80px;
    box-sizing: border-box;
    position: relative;

    @media ${Device.smallAndDown} {
        padding: 0 25px;
    }
`

export default function App () {
    Aos.init()

    return (
        <Main>
            <Introduction />
            <Separator />
            <Projects />
            <Separator />
            <Footer />
        </Main>
    )
}

