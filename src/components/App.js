import React from 'react'
import WOW from 'wowjs';
import styled from 'styled-components'

import Device from '../Device'
import Introduction from './Introduction'
import Separator from 'components/Separator'
import Projects from './Projects'
import Footer from './Footer'

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
    new WOW.WOW({
        live: false
    }).init();

    return (
        <Main>
            <Introduction />
            <Separator/>
            <Projects />
            <Separator/>
            <Footer />
        </Main>
    )
}

