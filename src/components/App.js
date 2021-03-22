import React from 'react'
import WOW from 'wowjs';
import styled from 'styled-components'

import Separator from 'components/Separator'
import Introduction from './Introduction'
import Projects from './Projects'
import Footer from './Footer'
import Device from '../Device'

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

