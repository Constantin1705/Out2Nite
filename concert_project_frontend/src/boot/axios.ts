import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

export default boot(({ app }) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
