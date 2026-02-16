import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, ChevronRight, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { getOWASPTop10 } from '../utils/api'

export default function OWASPTop10() {
  const [owaspData, setOwaspData] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOWASPTop10()
        setOwaspData(response.data)
      } catch (error) {
        console.error('Failed to fetch OWASP data:', error)
      }
    }
    fetchData()
  }, [])

  const getRiskColor = (risk) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    }
    return colors[risk] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }

  if (!owaspData) return null

  return (
    <div className="glass rounded-2xl p-8 shadow-xl" id="owasp">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">OWASP Top 10 2021</h2>
          <p className="text-gray-600 dark:text-gray-400">Industry standard for web application security</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(owaspData).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelected(selected === key ? null : key)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected === key 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-sm text-primary-600 dark:text-primary-400 font-bold">{key}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRiskColor(value.risk)}`}>
                {value.risk}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{value.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{value.description}</p>
            
            {selected === key && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Common Examples:</p>
                <ul className="space-y-1">
                  {value.examples.map((example, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-primary-500" />
                      {example}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <a 
          href="https://owasp.org/Top10/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          View Official OWASP Top 10
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}