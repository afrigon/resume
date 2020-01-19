import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled, { ThemeContext } from 'styled-components'

const defaultTheme = {
    black: '#2A2D39'
}

const H1 = props => {
    const themeContext = useContext(ThemeContext) || defaultTheme

    const Text = styled.h1`
        margin: 0;
        padding: 0;
        color: ${themeContext.black};
    `
    return <Text {...props} />
}

const H2 = props => {
    const themeContext = useContext(ThemeContext) || defaultTheme

    const Text =  styled.h2`
        margin: 0;
        padding: 0;
        text-align: center;
        color: ${themeContext.black};
    `
    return <Text {...props} />
}

const propTypes = {
    children: PropTypes.node
}

H1.propTypes = propTypes
H2.propTypes = propTypes

export { H1, H2 }

