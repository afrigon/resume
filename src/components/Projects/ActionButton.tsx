import styled from "styled-components"

import Color from "../../Color"
import Device from "../../Device"

const Container = styled.div`
    display: inline-block;
    position: relative;
    padding: 22px 32px;
    border: solid 2px rgba(255, 255, 255, 0.4);
    border-radius: 8px;

    @media ${Device.mediumAndDown} {
        padding: 11px 16px;
    }

    @media ${Device.smallAndDown} {
        padding: 11px 16px;
    }
`

const Text = styled.p`
    font-size: 24px;
    color: ${Color.white};
    text-align: center;

    @media ${Device.mediumAndDown} {
        font-size: 20px;
    }

    @media ${Device.smallAndDown} {
        font-size: 16px;
    }
`

const Filter = styled.div`
    background-color: ${Color.white};
    opacity: 0.1;
    display: inline-block;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;

    &:hover {
        opacity: 0.2;
    }
`

export default function ActionButton(props) {
    const { action, href } = props

    return (
        <a href={href} target="_blank" rel="noreferrer">
            <Container>
                <Text>{action}</Text>
                <Filter />
            </Container>
        </a>
    )
}
