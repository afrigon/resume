import styled from "styled-components"

import Color from "../Color"
import Device from "../Device"

const H1 = styled.h1`
    font-size: 130px;
    font-weight: bold;
    text-align: left;
    color: ${Color.black};
    margin-bottom: 20px;

    @media ${Device.mediumAndDown} {
        font-size: 110px;
    }

    @media ${Device.smallAndDown} {
        font-size: 80px;
    }
`

const H2 = styled.h2`
    font-size: 100px;
    font-weight: bold;
    text-align: center;
    color: ${Color.black};

    @media ${Device.mediumAndDown} {
        font-size: 75px;
    }

    @media ${Device.smallAndDown} {
        font-size: 50px;
    }
`

const H3 = styled.h3`
    font-size: 90px;
    font-weight: bold;
    text-align: left;
    color: ${Color.white};

    @media ${Device.mediumAndDown} {
        font-size: 55px;
    }

    @media ${Device.smallAndDown} {
        font-size: 45px;
    }
`

const H4 = styled.h4`
    font-size: 50px;
    font-weight: normal;
    text-align: left;
    color: ${Color.blueText};

    @media ${Device.mediumAndDown} {
        font-size: 45px;
    }

    @media ${Device.smallAndDown} {
        font-size: 35px;
    }
`

const P = styled.p`
    font-size: 24px;
    line-height: 27px;
    font-weight: normal;
    text-align: left;
    color: ${Color.black};
`

export { H1, H2, H3, H4, P }

