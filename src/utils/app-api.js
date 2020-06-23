import axios from 'axios'
export const appApi = axios.create({
  baseURL: 'http://localhost:8000',
  // 'https://auxstack.herokuapp.com/',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  }
})
