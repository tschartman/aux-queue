import gql from 'graphql-tag'

export const GET_FOLLOWERS_QUERY = gql`
  query getFollowers {
    followers {
      id
      status
      follower {
        userName
        firstName
        lastName
        email
        accessToken
      }
    }
  }
`

export const GET_FOLLOWING_QUERY = gql`
  query getFollowing {
    following {
      id
      status
      following {
        userName
        firstName
        lastName
        email
        accessToken
      }
    }
  }
`

export const SEND_FOLLOW_MUTATION = gql`
  mutation sendFollowRequest($userName: String!) {
    sendFollowRequest(input: { userName: $userName }) {
      ok
    }
  }
`

export const UPDATE_FOLLOW_MUTATION = gql`
  mutation UpdateFollowRequest($id: ID!, $status: String!) {
    updateFollowRequest(input: { id: $id, status: $status }) {
      ok
      following {
        id
        status
        following {
          userName
          firstName
          lastName
          email
          accessToken
        }
      }
    }
  }
`

export const UPDATE_FOLLOWER_MUTATION = gql`
  mutation UpdateFollowerRequest($id: ID!, $status: String!) {
    updateFollowerRequest(input: { id: $id, status: $status }) {
      ok
      follower {
        id
        status
        follower {
          userName
          firstName
          lastName
          email
          accessToken
        }
      }
    }
  }
`

export const REMOVE_FOLLOW_MUTATION = gql`
  mutation RemoveFollowRequest($id: ID!) {
    removeFollowRequest(input: { id: $id }) {
      ok
    }
  }
`

export const REMOVE_FOLLOWER_MUTATION = gql`
  mutation RemoveFollowerRequest($userName: String!) {
    removeFollowerRequest(input: { userName: $userName }) {
      ok
    }
  }
`
