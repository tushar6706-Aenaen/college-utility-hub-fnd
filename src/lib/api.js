import axios from 'axios'

// Normalize API URL
const rawApiUrl = import.meta.env.VITE_API_URL
const normalizedApiUrl = rawApiUrl
  ? rawApiUrl.replace(/\/$/, '').endsWith('/api')
    ? rawApiUrl.replace(/\/$/, '')
    : `${rawApiUrl.replace(/\/$/, '')}/api`
  : 'http://localhost:5000/api'

console.log('🔗 API Base URL:', normalizedApiUrl)

const api = axios.create({
  baseURL: normalizedApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
  timeout: 15000, // 15 second timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })

    // Handle unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'
      }
    }

    // Provide better error messages
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - server took too long to respond'
    } else if (error.message === 'Network Error') {
      error.message = 'Cannot connect to server. Please check if the server is running.'
    }

    return Promise.reject(error)
  }
)

export default api