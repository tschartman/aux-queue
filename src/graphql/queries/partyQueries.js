import gql from 'graphql-tag'

export const GET_PARTIES_QUERY = gql`
  query getParties {
    parties {
      id
      name
      limitRequests
      currentlyPlaying {
        coverUri
      }
      host {
        userName
      }
      queue {
        id
        song {
          title
          album
          artist
          coverUri
          songUri
        }
        rating {
          user {
            userName
          }
          like
        }
      }
      guests {
        id
        status
        user {
          userName
        }
      }
    }
  }
`
export const PARTIES_UPDATED_SUBSCRIPTION = gql`
  subscription partiesUpdated($userName: String!) {
    partiesUpdated(userName: $userName) {
      id
      name
      limitRequests
      currentlyPlaying {
        coverUri
      }
      host {
        userName
      }
      queue {
        id
        song {
          title
          album
          artist
          coverUri
          songUri
        }
        rating {
          user {
            userName
          }
          like
        }
      }
      guests {
        id
        status
        user {
          userName
        }
      }
    }
  }
`

export const PARTY_CREATED_SUBSCRIPTION = gql`
  subscription partyCreated($userName: String!) {
    partyCreated(userName: $userName) {
      id
      name
      limitRequests
      currentlyPlaying {
        coverUri
      }
      host {
        userName
      }
      guests {
        id
        status
        user {
          userName
        }
      }
    }
  }
`

export const PARTY_DELETED_SUBSCRIPTION = gql`
  subscription partyDeleted($userName: String!) {
    partyDeleted(userName: $userName) {
      id
    }
  }
`

export const PARTY_UPDATED_SUBSCRIPTION = gql`
  subscription partyUpdated($id: ID!) {
    partyUpdated(id: $id) {
      id
      name
      limitRequests
      host {
        userName
      }
      guests {
        id
        status
        allowedRequests
        amountRequested
        user {
          userName
          userImage
        }
      }
      currentlyPlaying {
        title
        artist
        album
        coverUri
      }
      queue {
        id
        song {
          title
          album
          artist
          coverUri
          songUri
        }
        rating {
          user {
            userName
          }
          like
        }
      }
    }
  }
`

export const GET_PARTY_QUERY = gql`
  query getParty($id: ID!) {
    party(id: $id) {
      id
      name
      limitRequests
      host {
        userName
      }
      guests {
        id
        status
        allowedRequests
        amountRequested
        user {
          userName
          userImage
        }
      }
      currentlyPlaying {
        title
        artist
        album
        coverUri
      }
      queue {
        id
        song {
          title
          album
          artist
          coverUri
          songUri
        }
        rating {
          user {
            userName
          }
          like
        }
      }
    }
  }
`

export const RATE_SONG_MUTATION = gql`
  mutation rateSong($id: ID!, $like: Boolean!, $partyId: ID!) {
    rateSong(input: { id: $id, like: $like, partyId: $partyId }) {
      ok
    }
  }
`

export const REMOVE_SONG_MUTATION = gql`
  mutation removeSong($id: ID!) {
    removeSong(input: { id: $id }) {
      ok
    }
  }
`

export const REMOVE_RATING_MUTATION = gql`
  mutation removeRating($id: ID!, $partyId: ID!) {
    removeRating(input: { id: $id, partyId: $partyId }) {
      ok
    }
  }
`

export const SUGGEST_SONG_MUTATION = gql`
  mutation suggestSong($input: SuggestSongInput!) {
    suggestSong(input: $input) {
      ok
      suggested {
        id
        song {
          title
          album
          artist
          coverUri
          songUri
        }
        rating {
          user {
            userName
          }
          like
        }
      }
    }
  }
`

export const UPDATE_ALLOWED_REQUEST = gql`
  mutation updateAllowedRequests($id: ID!, $amount: Int!) {
    updateAllowedRequests(input: { amount: $amount, id: $id }) {
      ok
      guest {
        allowedRequests
      }
    }
  }
`

export const LEAVE_PARTY_MUTATION = gql`
  mutation leaveParty {
    leaveParty {
      ok
    }
  }
`
export const ALLOW_IN_PARTY_MUTATION = gql`
  mutation AllowInParty($id: ID!) {
    allowInParty(input: { id: $id }) {
      ok
      party {
        limitRequests
        guests {
          id
          status
          allowedRequests
          amountRequested
          user {
            userName
            userImage
          }
        }
      }
    }
  }
`

export const REMOVE_FROM_PARTY_MUTATION = gql`
  mutation RemoveFromParty($id: ID!) {
    removeFromParty(input: { id: $id }) {
      ok
      party {
        limitRequests
        guests {
          id
          status
          allowedRequests
          amountRequested
          user {
            userName
            userImage
          }
        }
      }
    }
  }
`

export const SHUT_DOWN_PARTY_MUTATION = gql`
  mutation shutDownParty {
    shutDownParty {
      ok
    }
  }
`

export const REFRESH_CURRENT_SONG = gql`
  mutation refreshCurrentSong($userName: String!) {
    refreshCurrentSong(input: { userName: $userName }) {
      ok
      currentSong {
        title
        artist
        album
        coverUri
      }
    }
  }
`

export const JOIN_PARTY_MUTATION = gql`
  mutation joinParty($userName: String!) {
    joinParty(input: { userName: $userName }) {
      ok
      party {
        limitRequests
        guests {
          id
          status
          allowedRequests
          amountRequested
          user {
            userName
            userImage
          }
        }
      }
    }
  }
`

export const CREATE_PARTY_MUTATION = gql`
  mutation createParty($name: String!, $limit: Boolean!, $requests: Int!) {
    createParty(input: { name: $name, limit: $limit, requests: $requests }) {
      ok
      party {
        id
      }
    }
  }
`
