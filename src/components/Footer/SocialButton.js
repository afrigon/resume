import styled from 'styled-components'

const Container = styled.div`
    width: 210px;
    height: 210px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 75px;
    margin: 30px 55px;
`

export default function SocialButton(props) {
    return (
        <a href={props.href} target="_blank" rel="noreferrer">
            <Container style={{backgroundColor: props.color || "#FFF"}}>
                <img style={{height: 120, width: 120, ...props.imgStyle}} src={props.src} alt={props.alt}  />
            </Container>
        </a>
    )
}
