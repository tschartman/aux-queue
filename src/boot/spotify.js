import Vue from 'vue'
import axios from 'axios'

import Store from 'src/store'
import { appApi } from 'src/utils/app-api'

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
      if (
        Store.getters.spotifyToken !== undefined &&
        Store.getters.spotifyToken != null
      ) {
        if (!isAlreadyFetchingAccessToken) {
          const refreshToken = Store.getters.spotifyRefresh
          isAlreadyFetchingAccessToken = true
          const refresh = await appApi.post('/spotify/refresh', {
            token: refreshToken
          })
          isAlreadyFetchingAccessToken = false
          onAccessTokenFetched(refresh.data.accessToken)
          const data = {
            accessToken: refresh.data.accessToken,
            refresh_token: refreshToken
          }

          Store.dispatch('linkSpotify', data)
        }
      } else {
        return Promise.reject({ error: 'No spotify token set' })
      }

      const retryOriginalRequest = new Promise(resolve => {
        addSubscriber(accessToken => {
          originalRequest.headers.Authorization = 'Bearer ' + accessToken
          resolve(axios(originalRequest))
        })
      })
      return retryOriginalRequest
    } else if (error.response.status === 401) {
      console.log('here')
    }

    return Promise.reject(error)
  }
)
Vue.prototype.$spotify = spotifyApi
