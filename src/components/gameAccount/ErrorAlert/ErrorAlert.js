
import React from 'react'
import PropTypes from 'prop-types'

import { Alert } from '@mui/material'
import Collapse from '@mui/material/Collapse';
import classes from './ErrorAlert.module.css'

function ErrorAlert({ error }) {
    return (
        <div className={classes.container} >
            <Collapse in={Boolean(error)}>
                <Alert
                    severity="error" sx={{
                        alignItems: 'center'
                    }}
                >
                    {error}
                </Alert>
            </Collapse>

        </div>
    )
}

ErrorAlert.propTypes = {
    error: PropTypes.string,
}

ErrorAlert.defaultProps = {}

export default ErrorAlert