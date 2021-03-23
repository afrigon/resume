import styled from 'styled-components'

import { H3 } from 'components/Text'
import Color from '../../Color'
import Device from '../../Device'
import ActionButton from './ActionButton'
import Circle from 'components/Circle'

const Container = styled.div(props => `
    border-radius: 43px;
    position: relative;
    overflow: hidden;
    margin: 50px 0;
    background-color: ${props.color};
`)

const ContentContainer = styled.div(props => `
    padding: 10px 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
    flex-direction: ${props.gravity === "left" ? "row" : "row-reverse"};

    @media ${Device.mediumAndDown} {
        flex-direction: column !important;
        padding: 10px 20px;
    }
    
    @media ${Device.smallAndDown} {
        padding: 0 20px;
    }

`)

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

const Description = styled.p(props => `
    font-size: 36px;
    text-align: ${props.gravity};
    color: ${Color.white};
    line-height: 54px;
    opacity: 0.64;
    margin: 48px 0;

    @media ${Device.mediumAndDown} {
        font-size: 26px;
        line-height: 33px;
        margin: 32px 0;
    }

    @media ${Device.smallAndDown} {
        font-size: 24px;
        line-height: 27px;
        margin: 24px 0;
    }
`)

const TextContainer = styled.div(props => `
    text-align: ${props.gravity};
    margin: 40px 20px;

    @media ${Device.mediumAndDown} {
        text-align: center !important;

        h3, ${Description} {
            text-align: left !important;
        }
    }
`)

const CircleItem = styled(Circle)(props => `
    position: absolute;
    opacity: ${props.color === "white" ? "0.19" : "0.12"};

    @media ${Device.mediumAndDown} {
        &.hide-medium-and-down {
            display: none;
        }
    }
`)

const circlePatterns = [
    <>
        <CircleItem color="white" size={486} style={{left: -86, bottom: -149}} />
        <CircleItem color="#171717" size={303} style={{left: 310, bottom: -118}} />
        <CircleItem className="hide-medium-and-down" color="white" size={467} style={{right: 131, bottom: -351}} />
        <CircleItem className="hide-medium-and-down" color="#171717" size={247} style={{right: 58, bottom: -32}} />
        <CircleItem color="white" size={443} style={{right: -270, top: 64}} />
    </>,
    <>
        <CircleItem color="white" size={486} style={{left: -137, top: -179}} />
        <CircleItem color="#171717" size={303} style={{left: -122, top: 239}} />
        <CircleItem color="white" size={443} style={{left: "15%", bottom: -278}} />
        <CircleItem className="hide-medium-and-down" color="white" size={467} style={{right: -27, top: -169}} />
        <CircleItem className="hide-medium-and-down" color="#171717" size={247} style={{right: 371, top: -36}} />
    </>,
    <>
        <CircleItem color="white" size={486} style={{left: -86, bottom: -149}} />
        <CircleItem color="#171717" size={303} style={{left: -177, bottom: 169}} />
        <CircleItem className="hide-medium-and-down" color="white" size={443} style={{left: "20%", top: -299}} />
        <CircleItem className="hide-medium-and-down" color="white" size={397} style={{right: 210, top: "15%"}} />
        <CircleItem color="#171717" size={247} style={{right: 59, bottom: 87}} />
    </>,

]

export default function Project(props) {
    const { title, description, href, src, altsrc, action, color, gravity, imgStyle } = props

    return (
        <Container color={color}>
            <ContentContainer gravity={gravity}>
                <TextContainer gravity={gravity}>
                    <H3 style={{ textAlign: gravity }}>{title}</H3>
                    <Description gravity={gravity}>{description}</Description>
                    <ActionButton action={action} href={href} />
                </TextContainer>
                <ImageContainer>
                    <picture>
                        <source srcset={src} type="image/webp" />
                        <source srcset={altsrc} type="image/jpeg" />

                        <Image src={src} alt={`${title} Demo Image`} style={imgStyle} />
                    </picture>
                </ImageContainer>

            </ContentContainer>
            {circlePatterns[Math.floor(Math.random() * circlePatterns.length)]}
        </Container>
    )
}
