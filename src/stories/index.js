import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { H1 } from '../components/Text'

storiesOf('Typography', module)
    .add('Heading 1', () => <H1>Heading 1</H1>)

