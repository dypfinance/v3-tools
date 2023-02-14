import React from 'react'
import PropTypes from 'prop-types'
import TitleWithParagraph from '../../General/TitleWithParagraph'
import './_nftMintingHero.scss'

const NftMintingHero = ({smallTitle, bigTitle}) => {
    return (
        <div className="nft-minting-hero ">
            <div className="bg-image"></div>
            <div className="text-wrapper">
                <TitleWithParagraph>
                    <h1>
                        <small>{smallTitle}</small>
                        <br />
                        {bigTitle}
                    </h1>
                </TitleWithParagraph>
            </div>

        </div>
    )
}

NftMintingHero.propTypes = {
    smallTitle: PropTypes.string,
    bigTitle: PropTypes.string,
}

export default NftMintingHero