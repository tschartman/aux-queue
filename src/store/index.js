import Vue from 'vue'
import Vuex from 'vuex'
import { appApi } from 'src/utils/app-api'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex)

appApi.defaults.xsrfCookieName = 'csrftoken'
appApi.defaults.xsrfHeaderName = 'X-CSRFToken'

const getDefaultState = () => {
  return {
    page: 'home',
    status: 'pending',
    expires_in: null,
    token: null,
    refresh: null,
    auth: false,
    party: false,
    user: {}
  }
}

const Store = new Vuex.Store({
  state: getDefaultState(),
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) =>
          // Set secure to true in prod!!!
          Cookies.set(key, value, {
            expires: 3,
            secure: !window.webpackHotUpdate
          }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ],
  mutations: {
    updateStatus (state, status) {
      this.state = status
    },
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, token) {
      state.status = 'success'
      state.auth = true
      state.token = token
    },
    navigate (state, page) {
      state.page = page
    },
    start_party (state) {
      state.party = true
    },
    shut_down_party (state) {
      state.party = false
    },
    set_user (state, user) {
      state.user = user
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      Object.assign(state, getDefaultState())
    }
  },
  actions: {
    login ({ commit }, authData) {
      commit('auth_success', authData.data.tokenAuth.token)
      return true
    },
    linkUser ({ commit }, data) {
      commit('set_user', data)
    },
    navigate ({ commit }, page) {
      commit('navigate', page)
    },
    startParty ({ commit }) {
      commit('start_party')
    },
    shutDownParty ({ commit }) {
      commit('shut_down_party')
    },
    tempAuth ({ commit }) {
      commit('auth_success', null, null, null)
    },
    refresh ({ commit }, refresh) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        appApi({
          url: '/api/token/refresh/',
          data: { refresh: refresh },
          method: 'POST'
        })
          .then(resp => {
            const token = resp.data.access
            commit('auth_success', token)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            console.log(err)
            reject(err)
          })
      })
    },
    logout ({ commit }) {
      return new Promise(resolve => {
        commit('logout')
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => state.auth,
    authStatus: state => state.status,
    token: state => state.token,
    user: state => state.user,
    party: state => state.party,
    page: state => state.page
  }

  // enable strict mode (adds overhead!)
  // for dev mode only
  // strict: process.env.DEV
})

export default Store
