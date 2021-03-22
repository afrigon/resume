import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import App from './components/App'
import { register as ServiceWorker } from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
ServiceWorker()

