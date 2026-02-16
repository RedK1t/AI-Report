import { Shield, Moon, Sun, Github, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Layout({ children, darkMode, setDarkMode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl blur-lg opacity-50 animate-pulse-slow" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  PentestAI
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Professional Security Reports</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href="#owasp" 
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                OWASP Top 10
              </a>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Shield className="w-5 h-5 text-primary-500" />
              <span className="font-semibold">PentestAI</span>
              <span className="text-sm">© 2024</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>FastAPI + React</span>
              <span>•</span>
              <span>OWASP Top 10 2021</span>
              <span>•</span>
              <span>CVSS v3.1</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}