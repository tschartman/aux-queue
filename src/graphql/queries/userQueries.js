import gql from 'graphql-tag'

export const USER_DATA_QUERY = gql`
  query getUser {
    user {
      email
      userName
    }
  }
`

export const USER_CREATION_MUTATON = gql`
  mutation createUser(
    $userName: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      input: {
        userName: $userName
        email: $email
        password: $password
      }
    ) {
      ok
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser(
    $email: String!
  ) {
    updateUser(
      input: { email: $email }
    ) {
      ok
      user {
        email
        userName
      }
    }
  }
`

export const UPDATE_USER_NAME_MUTATION = gql`
  mutation updateUserName($userName: String!) {
    updateUserName(input: { userName: $userName }) {
      ok
      userName
    }
  }
`

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation updatePassword($oldPass: String!, $newPass: String!) {
    updatePassword(input: { oldPass: $oldPass, newPass: $newPass }) {
      ok
      error
    }
  }
`

export const CHECK_USER_MUTATION = gql`
  mutation checkUserName($userName: String!) {
    checkUserName(input: { userName: $userName }) {
      ok
    }
  }
`

export const GET_USERS_QUERY = gql`
  query getUsers {
    users {
      userName
      userImage
    }
  }
`

export const GET_RND_USER_NAME = gql`
  query getUserName {
    userName
  }
`
