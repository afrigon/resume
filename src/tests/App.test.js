import React from 'react'
import ReactDOM from 'react-dom'

import App from './src/components/App'

const render = c => {
    const div = document.createElement('div')
    ReactDOM.render(c, div)
    ReactDOM.unmountComponentAtNode(div)
}

it('renders without crashing', render(<App />))

