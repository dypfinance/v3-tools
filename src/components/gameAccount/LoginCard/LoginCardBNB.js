import React from 'react'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card';
import { outlineBorder } from '../../Themes/Images';

function LoginCardBNB({ children, containerStyles, cardStyles }) {
    return (
        <div
            style={{
                backgroundImage: `url(${outlineBorder})`,
                backgroundRepeat: 'no-repeat',
                padding: '15px',
                width: '100%',
                backgroundSize: '100% 100%',
                ...containerStyles
            }
            }
        >
            <Card sx={{
                // minWidth: 500,
                background: "rgba(255, 255, 255, 0.05)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                ...cardStyles
            }}>
                {children}
            </Card>
        </div >

    )
}

LoginCardBNB.propTypes = {
    children: PropTypes.any,
    containerStyles: PropTypes.object,
    cardStyles: PropTypes.object,
}



export default LoginCardBNB