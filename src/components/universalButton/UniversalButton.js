import React from 'react'
import './universalbutton.css'

const UniversalButton = ({title, loading, onClick, failState}) => {
  return (
    <button disabled={loading} className={`btn success-button ${failState && "fail-button"} d-flex justify-content-center align-items-center`} style={{width: '120px', height: '40px'}} onClick={onClick}>
     {!loading ? 
     
     <>{title}</>
   : 
   <div class="spinner-border spinner-border-sm text-light" role="status">
     <span class="visually-hidden">Loading...</span>
   </div>
    }
    </button>
  )
}

export default UniversalButton