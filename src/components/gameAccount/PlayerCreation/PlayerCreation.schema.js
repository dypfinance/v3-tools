import { gql } from '@apollo/client'

export const CREATE_PLAYER = gql`
mutation onCreatePlayer(
  $displayName: String!
  $password: String!
) {
    createPlayer(
        input: {
            displayName: $displayName
            password: $password
        }
  ) {
    displayName
    playerId
  }
}
`