import styled from 'styled-components'

import { H1, H4 } from 'components/Text'
import Circle from 'components/Circle'
import Color from '../../Color'

const Container = styled.div`
    position: relative;
    left: 0;
    top: 0px;
    z-index: 11;
`

const Title = styled(H1)`
    margin: 240px 0 0 40px;
`

const Subtitle = styled(H4)`
    margin-left: 40px;
`

const OrangeCircle = styled.div`
    margin-left: 160px;
    margin-top: 40px;
`

const GreenCircle = styled.div`
    margin: 35px 0;
`

const BlueCircle = styled.div`
    position: absolute;
    left: 50%;
    top: 60px;
    width: 50%;
    z-index: 10;
`

const Line = styled.div(props => `
    display: inline-block;
    background-color: #2A2D39;
    width: ${props.width};
    height: ${props.height};
    margin-left: ${props.offsetX};
    margin-top: ${props.offsetY};
    vertical-align: top;
    position: relative;
    z-index: 1;
    opacity: 0.5;
`)

export default function Introduction() {
    return (
        <>
            <Container>
                <Title>Hi I'm Alex.</Title>
                <Subtitle>Software Developer</Subtitle>
                <GreenCircle>
                    <Circle className="wow zoomIn" data-wow-delay="300ms" size={80} color={Color.green} style={{display: 'inline-block'}} />
                    <Line width="100px" height="5px" offsetX="-35px" offsetY="28px" />
                </GreenCircle>
                <OrangeCircle>
                    <Circle size={265} color={Color.orange} />
                </OrangeCircle>
                <OrangeCircle className="wow zoomIn" data-wow-delay="600ms" size={265} color={Color.orange} />
            </Container>
            <BlueCircle>
                <Circle style={{position: 'absolute'}} className="wow zoomIn" size={788} color={Color.blue} />
            </BlueCircle>
        </>
    )
}
