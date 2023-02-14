import React from 'react'
import './disabledbutton.css'

const DisabledButton = ({title, onClick}) => {
  return (
    <button disabled className="btn disabled-btn" onClick={onClick}>{title}</button>
  )
}

export default DisabledButton