import styled from "styled-components"

import Color from "../Color"
import Circle from "./Circle"

const Container = styled.div`
    margin: 60px 0;
    display: flex;
    justify-content: center;
    align-items: center;
`

const style = { paddingLeft: 5, paddingRight: 5 }

export default function Separator () {
    return (
        <Container>
            <Circle data-aos="slide-up" data-aos-delay="100" style={style} size={20} color={Color.blue} />
            <Circle data-aos="slide-up" data-aos-delay="200" style={style} size={20} color={Color.orange} />
            <Circle data-aos="slide-up" data-aos-delay="300" style={style} size={20} color={Color.green} />
        </Container>
    )
}

