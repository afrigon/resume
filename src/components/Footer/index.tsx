import styled from 'styled-components'

import { H2 } from '../Text'
import SocialButton from './SocialButton'
import Device from '../../Device'

import github from "./logo-github.png"
import linkedin from "./logo-linkedin.png"
import email from "./logo-email.svg"

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 45px 0 120px 0;

    @media ${Device.mediumAndDown} {
        flex-direction: column;
        margin: 40px 0 50px 0;
    }
`

export default function Footer() {
    return (
        <div>
            <H2>Get in touch</H2>
            <Container>
                <SocialButton href="https://github.com/afrigon" color="#171516" src={github} alt="Github Logo" />
                <SocialButton href="https://www.linkedin.com/in/afrigon/" color="#2867B2" imgStyle={{ paddingLeft: 9, height: 102 }} src={linkedin} alt="LinkedIn Logo" />
                <SocialButton href="mailto:alexandre.frigon.1@gmail.com" color="#9C9C9C" src={email} alt="Email Logo" />
            </Container>
        </div>
    )
}
