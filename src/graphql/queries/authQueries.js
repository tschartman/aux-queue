import gql from 'graphql-tag'

export const TOKEN_AUTH_MUTATION = gql`
  mutation tokenAuth($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
    }
  }
`
