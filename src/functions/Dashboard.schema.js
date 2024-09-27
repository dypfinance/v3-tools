import { gql } from '@apollo/client'

export const GET_PLAYER = gql`
query GetPlayer {
  getPlayer {
    playerId
    displayName
    coins
    wallet {
      publicAddress
      createdAt
    }
    dypCoefficient
  }
}
`


export const GENERATE_NONCE = gql`
mutation GenerateWalletNonce(
  $publicAddress:String!
) {
  generateWalletNonce(publicAddress: $publicAddress) {
    createdAt
    nonce
  }
}`

export const VERIFY_WALLET = gql`
mutation VerifyWallet(
  $publicAddress:String!
  $signature:String!
) {
  verifyWallet(input: {publicAddress: $publicAddress, signature:  $signature}) {
    createdAt
    publicAddress
  }
}`

export const REDEEM_TRANSACTION = gql`
mutation RedeemTransaction (
  $transactionHash:String!
){
  redeemTransaction(transactionHash:$transactionHash) {
    dypCoefficient
    publicAddress
    updatedAt
    id
    createdAt
  }
}`