import { useState } from 'react'
import { 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Eye, 
  Code,
  FileCode,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function ReportPreview({ report, isLoading }) {
  const [activeTab, setActiveTab] = useState('preview')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!report) return
    try {
      await navigator.clipboard.writeText(report.markdown_content || report.html_content)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const handleDownloadHTML = () => {
    if (!report) return
    const blob = new Blob([report.html_content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vulnerability-report-${report.id}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('HTML report downloaded!')
  }

  const handleDownloadMarkdown = () => {
    if (!report) return
    const blob = new Blob([report.markdown_content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vulnerability-report-${report.id}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Markdown report downloaded!')
  }

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-8 shadow-xl h-full min-h-[600px] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-primary-500" />
        </motion.div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Generating professional report...</p>
        <div className="mt-4 w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl shadow-xl overflow-hidden flex flex-col h-full min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-500" />
          Report Preview
        </h3>
        
        {report && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      {report && (
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'preview' 
                ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'html' 
                ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <Code className="w-4 h-4" />
            HTML
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'markdown' 
                ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Markdown
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900">
        <AnimatePresence mode="wait">
          {!report ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-gray-400"
            >
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-purple-200 dark:from-primary-900/30 dark:to-purple-900/30 rounded-2xl transform rotate-6" />
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
              </div>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-500">No report generated yet</p>
              <p className="text-sm mt-2">Fill in the details and click Generate</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'preview' && (
                <div 
                  className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: report.html_content }}
                />
              )}
              {activeTab === 'html' && (
                <div className="relative">
                  <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl overflow-auto text-xs font-mono text-gray-700 dark:text-gray-300 h-full max-h-[500px]">
                    {report.html_content}
                  </pre>
                  <button
                    onClick={handleDownloadHTML}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
              {activeTab === 'markdown' && (
                <div className="relative">
                  <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl overflow-auto text-xs font-mono text-gray-700 dark:text-gray-300 h-full max-h-[500px]">
                    {report.markdown_content}
                  </pre>
                  <button
                    onClick={handleDownloadMarkdown}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      {report && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex gap-2">
          <button
            onClick={handleDownloadHTML}
            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download HTML
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <FileCode className="w-4 h-4" />
            Download MD
          </button>
        </div>
      )}
    </div>
  )
}