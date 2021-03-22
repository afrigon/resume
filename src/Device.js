const size = {
    smallScreen: '600px',
    mediumScreen: '1100px',
}

const Device = {
    smallAndDown: `only screen and (max-width : ${size.smallScreen})`,
    mediumAndDown: `only screen and (max-width : ${size.mediumScreen})`
}

export default Device
