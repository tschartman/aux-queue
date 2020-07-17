import axios from 'axios'
import Store from 'src/store'
import { apolloClient } from './apollo'
import {
  SPOTIFY_REFRESH_MUTATION
} from 'src/graphql/queries/authQueries'

export const spotifyApi = axios.create({
  baseURL: 'https://api.spotify.com/v1'
})

let isAlreadyFetchingAccessToken = false
let subscribers = []

function onAccessTokenFetched (accessToken) {
  subscribers = subscribers.filter(callback => callback(accessToken))
}

function addSubscriber (callback) {
  subscribers.push(callback)
}

spotifyApi.interceptors.request.use(
  config => {
    if (
      Store.getters.spotifyToken !== undefined &&
      Store.getters.spotifyToken != null
    ) {
      config.headers.Authorization = 'Bearer ' + Store.getters.spotifyToken
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

spotifyApi.interceptors.response.use(
  function (response) {
    return response
  },

  async function (error) {
    const originalRequest = error.config
    if (error.response.status === 401) {
      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true
        const refreshed = await apolloClient.mutate({
          mutation: SPOTIFY_REFRESH_MUTATION
        })
        isAlreadyFetchingAccessToken = false
        onAccessTokenFetched(refreshed.data.refreshTokens.user.refreshToken)
        const data = {
          access_token: refreshed.data.refreshTokens.user.accessToken,
          refresh_token: refreshed.data.refreshTokens.user.refreshToken
        }
        Store.dispatch('linkSpotify', data)
      }

      const retryOriginalRequest = new Promise(resolve => {
        addSubscriber(accessToken => {
          originalRequest.headers.Authorization = 'Bearer ' + accessToken
          resolve(axios(originalRequest))
        })
      })
      return retryOriginalRequest
    }

    return Promise.reject(error)
  }
)
