import React from 'react'
import PropTypes from 'prop-types'

import './Input.css'

const Input = ({
    value,
    onChange,
    placeHolder,
    type,
    inputType,
    ...rest
}) => {

    const handleChange = (e) => {
        onChange(e?.target?.value)
    }

    return (
        <input
            autoComplete="new-password"
            type={inputType}
            className={`${type}Input`}
            value={value}
            onChange={handleChange}
            placeholder={placeHolder}
            {...rest}
        />
    )
}


Input.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeHolder: PropTypes.string,
    type: PropTypes.string,
    inputType: PropTypes.string,
}

Input.defaultProps = {
    type: 'primary',
    inputType: 'text'
}

export default Input