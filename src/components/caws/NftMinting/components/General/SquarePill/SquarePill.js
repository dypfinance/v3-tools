import React from 'react'
import PropTypes from "prop-types"
import './_squarePill.scss'

const SquarePill = ({ text }) => {
    return (
        <div className='square-pill'>{text}</div>
    )
}
SquarePill.propTypes = {
    text: PropTypes.string
}
export default SquarePill
