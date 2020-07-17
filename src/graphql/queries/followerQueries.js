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

export const RELATIONSHIP_CREATED_SUBSCRIPTION = gql`
  subscription relationshipCreated($userName: String!) {
    relationshipCreated(userName: $userName) {
      id
      status
      follower {
        userName
        firstName
        lastName
        email
        accessToken
      }
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

export const RELATIONSHIP_UPDATED_SUBSCRIPTION = gql`
  subscription relationshipUpdated($id: ID!) {
    relationshipUpdated(id: $id){
      id
      status
    }
  }
`
export const RELATIONSHIPS_UPDATED_SUBSCRIPTION = gql`
  subscription relationshipsUpdated($userName: String!) {
    relationshipsUpdated(userName: $userName){
      id
      status
      follower {
        userName
        firstName
        lastName
        email
        accessToken
      }
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

export const RELATIONSHIP_DELETED_SUBSCRIPTION = gql`
  subscription relationshipDeleted($id: ID!) {
    relationshipDeleted(id: $id){
      id
      status
    }
  }
`
export const RELATIONSHIPS_DELETED_SUBSCRIPTION = gql`
  subscription relationshipsDeleted($userName: String!) {
    relationshipsDeleted(userName: $userName){
      id
      status
      follower {
        userName
        firstName
        lastName
        email
        accessToken
      }
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
export const GET_FOLLOW_QUERY = gql`
  query getFollow($userName: String!) {
    follow(userName: $userName) {
      id
      status
      follower {
        userName
        firstName
        lastName
        email
        accessToken
      }
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
export const GET_FOLLOWER_QUERY = gql`
  query getFollower($userName: String!) {
    follower(userName: $userName) {
      id
      status
      follower {
        userName
        firstName
        lastName
        email
        accessToken
      }
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
  mutation RemoveFollowerRequest($id: ID!) {
    removeFollowerRequest(input: { id: $id }) {
      ok
    }
  }
`
