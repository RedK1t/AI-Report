import { useState, useEffect } from 'react'
import { Calculator, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { calculateCVSS } from '../utils/api'

export default function CVSSCalculator() {
  const [metrics, setMetrics] = useState({
    attack_vector: 'N',
    attack_complexity: 'L',
    privileges_required: 'N',
    user_interaction: 'N',
    scope: 'U',
    confidentiality: 'H'
  })
  const [result, setResult] = useState({ score: 0.0, severity: 'info' })

  useEffect(() => {
    handleCalculate()
  }, [metrics])

  const handleCalculate = async () => {
    try {
      const response = await calculateCVSS(metrics)
      setResult(response.data)
    } catch (error) {
      console.error('CVSS calculation failed:', error)
    }
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
      high: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
      medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
      low: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
      info: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'
    }
    return colors[severity] || colors.info
  }

  const MetricSelect = ({ label, name, options, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
      <select
        value={value}
        onChange={(e) => setMetrics(prev => ({ ...prev, [name]: e.target.value }))}
        className="text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500 outline-none"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )

  return (
    <div className="glass rounded-2xl p-5 shadow-lg sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary-500" />
        <h3 className="font-bold text-gray-900 dark:text-white">CVSS 3.1 Calculator</h3>
      </div>

      <div className="space-y-1 mb-4">
        <MetricSelect
          label="Attack Vector"
          name="attack_vector"
          value={metrics.attack_vector}
          options={[
            { value: 'N', label: 'Network' },
            { value: 'A', label: 'Adjacent' },
            { value: 'L', label: 'Local' },
            { value: 'P', label: 'Physical' }
          ]}
        />
        <MetricSelect
          label="Attack Complexity"
          name="attack_complexity"
          value={metrics.attack_complexity}
          options={[
            { value: 'L', label: 'Low' },
            { value: 'H', label: 'High' }
          ]}
        />
        <MetricSelect
          label="Privileges Required"
          name="privileges_required"
          value={metrics.privileges_required}
          options={[
            { value: 'N', label: 'None' },
            { value: 'L', label: 'Low' },
            { value: 'H', label: 'High' }
          ]}
        />
        <MetricSelect
          label="User Interaction"
          name="user_interaction"
          value={metrics.user_interaction}
          options={[
            { value: 'N', label: 'None' },
            { value: 'R', label: 'Required' }
          ]}
        />
        <MetricSelect
          label="Scope"
          name="scope"
          value={metrics.scope}
          options={[
            { value: 'U', label: 'Unchanged' },
            { value: 'C', label: 'Changed' }
          ]}
        />
        <MetricSelect
          label="Confidentiality"
          name="confidentiality"
          value={metrics.confidentiality}
          options={[
            { value: 'H', label: 'High' },
            { value: 'L', label: 'Low' },
            { value: 'N', label: 'None' }
          ]}
        />
      </div>

      <motion.div 
        className={`rounded-xl p-4 text-center ${getSeverityColor(result.severity)}`}
        key={result.score}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="text-3xl font-bold mb-1">{result.score.toFixed(1)}</div>
        <div className="text-sm font-semibold uppercase tracking-wider">{result.severity}</div>
      </motion.div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-2 text-xs text-blue-700 dark:text-blue-300">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>CVSS scores help prioritize vulnerabilities based on severity.</p>
      </div>
    </div>
  )
}