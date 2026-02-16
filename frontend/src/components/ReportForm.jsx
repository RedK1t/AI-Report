import { useState, useEffect } from 'react'
import { 
  Zap, 
  AlertTriangle, 
  FileText, 
  Code, 
  Target, 
  Shield, 
  Link2, 
  User,
  ChevronDown,
  Save,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { generateReport, calculateCVSS } from '../utils/api'

const QUICK_TEMPLATES = [
  { id: 'sqli', name: 'SQL Injection', icon: '🗄️', severity: 'critical', cvss: 9.8, cwe: 'CWE-89' },
  { id: 'xss', name: 'XSS', icon: '💉', severity: 'high', cvss: 7.5, cwe: 'CWE-79' },
  { id: 'idor', name: 'IDOR', icon: '🔓', severity: 'high', cvss: 7.5, cwe: 'CWE-639' },
  { id: 'csrf', name: 'CSRF', icon: '🎭', severity: 'medium', cvss: 6.5, cwe: 'CWE-352' },
  { id: 'rce', name: 'RCE', icon: '💻', severity: 'critical', cvss: 10.0, cwe: 'CWE-94' },
  { id: 'lfi', name: 'LFI/RFI', icon: '📁', severity: 'high', cvss: 7.5, cwe: 'CWE-98' },
]

const OWASP_CATEGORIES = [
  { value: 'A01:2021-Broken Access Control', label: 'A01:2021 - Broken Access Control' },
  { value: 'A02:2021-Cryptographic Failures', label: 'A02:2021 - Cryptographic Failures' },
  { value: 'A03:2021-Injection', label: 'A03:2021 - Injection' },
  { value: 'A04:2021-Insecure Design', label: 'A04:2021 - Insecure Design' },
  { value: 'A05:2021-Security Misconfiguration', label: 'A05:2021 - Security Misconfiguration' },
  { value: 'A06:2021-Vulnerable Components', label: 'A06:2021 - Vulnerable Components' },
  { value: 'A07:2021-Auth Failures', label: 'A07:2021 - Auth Failures' },
  { value: 'A08:2021-Data Integrity Failures', label: 'A08:2021 - Data Integrity Failures' },
  { value: 'A09:2021-Logging Failures', label: 'A09:2021 - Logging Failures' },
  { value: 'A10:2021-SSRF', label: 'A10:2021 - SSRF' },
]

export default function ReportForm({ setReport, isLoading, setIsLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    target_url: '',
    severity: 'medium',
    cvss_score: 6.5,
    cwe_id: '',
    description: '',
    poc: '',
    impact: '',
    remediation: '',
    references: 'https://owasp.org/www-project-top-ten/',
    reporter_name: '',
    owasp_category: '',
  })

  const [showTemplates, setShowTemplates] = useState(false)

  const handleTemplateSelect = (template) => {
    const descriptions = {
      'SQL Injection': 'The application constructs SQL queries using unsanitized user input, allowing attackers to manipulate database queries and access unauthorized data.',
      'XSS': 'The application displays user input without proper encoding, allowing injection of malicious scripts that execute in victims\' browsers.',
      'IDOR': 'Insecure Direct Object Reference allows attackers to access unauthorized resources by manipulating object identifiers in requests.',
      'CSRF': 'Cross-Site Request Forgery allows attackers to trick authenticated users into performing unintended actions.',
      'RCE': 'Remote Code Execution vulnerability allows attackers to execute arbitrary code on the server.',
      'LFI/RFI': 'Local/Remote File Inclusion vulnerabilities allow attackers to include unauthorized files, leading to code execution or data theft.'
    }

    const impacts = {
      'SQL Injection': 'Complete database compromise, data theft, authentication bypass, potential server takeover.',
      'XSS': 'Session hijacking, credential theft, defacement, malware distribution, phishing attacks.',
      'IDOR': 'Unauthorized access to sensitive data, privilege escalation, data manipulation or deletion.',
      'CSRF': 'Unauthorized actions on behalf of users, account modification, data changes.',
      'RCE': 'Complete system compromise, data breach, lateral movement, cryptomining.',
      'LFI/RFI': 'Source code disclosure, remote code execution, sensitive file access.'
    }

    const remediations = {
      'SQL Injection': '1. Use parameterized queries/prepared statements\n2. Implement ORM frameworks\n3. Input validation and sanitization\n4. Principle of least privilege for DB accounts\n5. Web Application Firewall (WAF)',
      'XSS': '1. Context-aware output encoding\n2. Content Security Policy (CSP) headers\n3. HTML sanitization libraries (DOMPurify)\n4. X-XSS-Protection header\n5. Input validation',
      'IDOR': '1. Implement proper access controls\n2. Use indirect object references (UUIDs)\n3. Validate user permissions server-side\n4. Deny by default approach',
      'CSRF': '1. CSRF tokens in forms\n2. SameSite cookie attribute\n3. Referer/Origin header validation\n4. Double-submit cookie pattern',
      'RCE': '1. Input sanitization and validation\n2. Avoid dangerous functions (eval, exec)\n3. Web Application Firewall\n4. Sandbox execution environment\n5. Principle of least privilege',
      'LFI/RFI': '1. Input validation and sanitization\n2. Whitelist allowed files\n3. Disable remote file inclusion\n4. Use absolute paths\n5. chroot jail'
    }

    setFormData(prev => ({
      ...prev,
      name: template.name + ' Vulnerability',
      severity: template.severity,
      cvss_score: template.cvss,
      cwe_id: template.cwe,
      description: descriptions[template.name] || '',
      impact: impacts[template.name] || '',
      remediation: remediations[template.name] || '',
      owasp_category: template.name === 'SQL Injection' || template.name === 'XSS' 
        ? 'A03:2021-Injection' 
        : template.name === 'IDOR' 
          ? 'A01:2021-Broken Access Control'
          : ''
    }))
    setShowTemplates(false)
    toast.success(`Template loaded: ${template.name}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.target_url || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await generateReport(formData)
      setReport(response.data)
      toast.success('Report generated successfully!')
      
      // Save to local storage
      const saved = JSON.parse(localStorage.getItem('pentestReports') || '[]')
      saved.unshift({
        id: response.data.id,
        timestamp: new Date().toISOString(),
        name: formData.name,
        severity: formData.severity,
        preview: response.data.html_content.substring(0, 200)
      })
      localStorage.setItem('pentestReports', JSON.stringify(saved.slice(0, 20)))
    } catch (error) {
      toast.error('Failed to generate report: ' + (error.response?.data?.detail || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const updateCVSSFromSeverity = (severity) => {
    const scores = { critical: 9.0, high: 7.5, medium: 5.5, low: 3.0, info: 0.0 }
    setFormData(prev => ({ ...prev, severity, cvss_score: scores[severity] }))
  }

  return (
    <div className="glass rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-500" />
          Vulnerability Details
        </h2>
        
        <div className="relative">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Quick Templates
            <ChevronDown className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
              >
                {QUICK_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className={`text-xs ${template.severity === 'critical' ? 'text-red-500' : template.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'}`}>
                        {template.severity.toUpperCase()} • CVSS {template.cvss}
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Vulnerability Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., SQL Injection in Login Form"
              className="input-field"
              required
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Target URL / Endpoint *
            </label>
            <input
              type="url"
              value={formData.target_url}
              onChange={(e) => setFormData(prev => ({ ...prev, target_url: e.target.value }))}
              placeholder="https://example.com/api/login"
              className="input-field font-mono text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Severity
            </label>
            <select
              value={formData.severity}
              onChange={(e) => updateCVSSFromSeverity(e.target.value)}
              className="input-field"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              CVSS Score
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.cvss_score}
              onChange={(e) => setFormData(prev => ({ ...prev, cvss_score: parseFloat(e.target.value) }))}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              CWE ID
            </label>
            <input
              type="text"
              value={formData.cwe_id}
              onChange={(e) => setFormData(prev => ({ ...prev, cwe_id: e.target.value }))}
              placeholder="CWE-89"
              className="input-field font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
            OWASP Category
          </label>
          <select
            value={formData.owasp_category}
            onChange={(e) => setFormData(prev => ({ ...prev, owasp_category: e.target.value }))}
            className="input-field"
          >
            <option value="">Select OWASP Category...</option>
            {OWASP_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the vulnerability, how it was discovered, and its context..."
            rows={3}
            className="input-field resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Proof of Concept (PoC)
          </label>
          <textarea
            value={formData.poc}
            onChange={(e) => setFormData(prev => ({ ...prev, poc: e.target.value }))}
            placeholder="curl -X POST https://target.com/api...
Or step-by-step reproduction instructions..."
            rows={4}
            className="input-field font-mono text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Impact
            </label>
            <textarea
              value={formData.impact}
              onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
              placeholder="What can an attacker achieve?"
              rows={3}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Remediation
            </label>
            <textarea
              value={formData.remediation}
              onChange={(e) => setFormData(prev => ({ ...prev, remediation: e.target.value }))}
              placeholder="Steps to fix this vulnerability..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              References
            </label>
            <input
              type="text"
              value={formData.references}
              onChange={(e) => setFormData(prev => ({ ...prev, references: e.target.value }))}
              placeholder="https://owasp.org/..."
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4" />
              Reporter Name
            </label>
            <input
              type="text"
              value={formData.reporter_name}
              onChange={(e) => setFormData(prev => ({ ...prev, reporter_name: e.target.value }))}
              placeholder="Your Name"
              className="input-field"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate AI Report
            </>
          )}
        </button>
      </form>
    </div>
  )
}