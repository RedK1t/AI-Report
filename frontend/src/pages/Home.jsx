import { useState } from 'react'
import { motion } from 'framer-motion'
import ReportForm from '../components/ReportForm'
import ReportPreview from '../components/ReportPreview'
import CVSSCalculator from '../components/CVSSCalculator'
import OWASPTop10 from '../components/OWASPTop10'

export default function Home() {
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
          AI-Powered Security Reports
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Generate professional penetration testing reports in seconds. 
          Powered by OWASP Top 10 intelligence and CVSS v3.1 scoring.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Sidebar - CVSS Calculator */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 space-y-6"
        >
          <CVSSCalculator />
        </motion.div>

        {/* Main Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5"
        >
          <ReportForm 
            setReport={setReport} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
          />
        </motion.div>

        {/* Preview Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4"
        >
          <ReportPreview 
            report={report} 
            isLoading={isLoading} 
          />
        </motion.div>
      </div>

      {/* OWASP Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-16"
      >
        <OWASPTop10 />
      </motion.div>
    </div>
  )
}