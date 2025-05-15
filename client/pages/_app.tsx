import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { DarkModeProvider } from '../lib/darkMode'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-white dark:bg-dark-primary text-gray-900 dark:text-dark-text transition-colors duration-200">
        <Component {...pageProps} />
      </div>
    </DarkModeProvider>
  );
} 