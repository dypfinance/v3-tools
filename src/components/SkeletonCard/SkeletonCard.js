import React from 'react'
import './skeletoncard.css'

const SkeletonCard = () => {
  return (
    <div className="skeleton-card p-3 d-flex flex-column position-relative">
        <div className="purplediv" style={{background: '#4A4D7B', top: '12px'}}></div>
        <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-center align-items-center gap-2">
                <div className="circle-div"></div>
                <div className="title-div"></div>
            </div>
            <div className="disburse-skeleton-div"></div>
        </div>
        <div className="d-flex mt-4 justify-content-between align-items-end">
            <div className="d-flex flex-column gap-2">
            <div className="expired-div"></div>
            <div className="expiry-date-div"></div>
            </div>
            <div className="details-div"></div>
        </div>
    </div>
  )
}

export default SkeletonCard