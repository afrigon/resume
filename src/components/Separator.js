import styled from 'styled-components'

import Color from '../Color'
import Circle from 'components/Circle'

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
            <Circle className="wow slideInUp" data-wow-delay="100ms" style={style} size={20} color={Color.blue} />
            <Circle className="wow slideInUp" data-wow-delay="200ms" style={style} size={20} color={Color.orange} />
            <Circle className="wow slideInUp" data-wow-delay="300ms" style={style} size={20} color={Color.green} />
        </Container>
    )
}

