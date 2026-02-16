import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const generateReport = (data) => api.post('/api/generate-report', data)
export const calculateCVSS = (metrics) => api.post('/api/calculate-cvss', metrics)
export const getOWASPTop10 = () => api.get('/api/owasp-top10')
export const exportPDF = (html) => api.post('/api/export-pdf', { report_html: html }, { responseType: 'blob' })

export default api