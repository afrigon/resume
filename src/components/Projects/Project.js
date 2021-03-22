import styled from 'styled-components'

import { H3 } from 'components/Text'
import Color from '../../Color'
import Device from '../../Device'
import ActionButton from './ActionButton'

const Container = styled.div`
    border-radius: 43px;
    padding: 10px 55px;
    margin: 50px 0;
    display: flex;
    justify-content: center;
    align-items: center;

    @media ${Device.mediumAndDown} {
        flex-direction: column !important;
        padding: 10px 20px;
    }
    
    @media ${Device.smallAndDown} {
        padding: 0 20px;
    }
`

const Image = styled.img`
    max-width: 100%;

    border-radius: 7px;
    box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14),
                0 6px 30px 5px rgba(0,0,0,0.12),
                0 8px 10px -7px rgba(0,0,0,0.2);

`

const ImageContainer = styled.div`
    margin: 40px 20px;
    min-width: 40%;
    text-align: center;

    @media ${Device.mediumAndDown} {
        margin: 0 20px 40px;
        max-width: 100%;
    }
`

const Description = styled.p`
    font-size: 36px;
    color: ${Color.white};
    line-height: 54px;
    opacity: 0.64;
    margin: 48px 0;

    @media ${Device.mediumAndDown} {
        font-size: 26px;
        line-height: 32px;
        margin: 32px 0;
    }

    @media ${Device.smallAndDown} {
        font-size: 24px;
        line-height: 27px;
        margin: 24px 0;
    }
`

const TextContainer = styled.div`
    margin: 40px 20px;

    @media ${Device.mediumAndDown} {
        text-align: center !important;

        h3, ${Description} {
            text-align: left !important;
        }
    }
`

export default function Project(props) {
    const { title, description, href, src, action, color, gravity, imgStyle } = props
    console.log(imgStyle)

    return (
        <Container style={{
            backgroundColor: color, 
            flexDirection: gravity === "left" ? "row" : "row-reverse"
        }}>
            <TextContainer style={{ textAlign: gravity }}>
                <H3 style={{ textAlign: gravity }}>{title}</H3>
                <Description style={{ textAlign: gravity }}>{description}</Description>
                <ActionButton action={action} href={href} />
            </TextContainer>
            <ImageContainer>
                <Image src={src} alt={`${title} Demo Image`} style={imgStyle} />
            </ImageContainer>
        </Container>
    )
}
