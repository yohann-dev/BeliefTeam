import Link from "next/link";
import Head from 'next/head';
import AnimatedBackground from "../components/AnimatedBackground";
import { useEffect, useState } from "react";
import axios from "axios";
import IdeaGenerationModal from "../components/IdeaGenerationModal";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Home() {
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

  useEffect(() => {
    const incrementVisit = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/visit`);
      } catch (error) {
        console.error('Error incrementing visit:', error);
      }
    };
    incrementVisit();
  }, []);

  return (
    <AnimatedBackground>
      <div className="min-h-screen">
        <Head>
          <link rel="icon" href="/logo-new.png" />
        </Head>
        {/* Top right buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <DarkModeToggle />
          <a 
            href="https://jup.ag/tokens/DddnaQ3Vtr829Scjk7WW8y6r5EBq9aarnfaz2FZ6dss9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            Buy $BELIEFTEAM
          </a>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">BeliefTeam</span>
            </h1>
            
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-20 md:text-xl md:max-w-3xl animate-bounce">
              Connect builders & believers in the tokenized idea economy
            </p>
            <div className="mt-20 grid grid-cols-2 gap-4 max-w-3xl mx-auto">
            <button 
                onClick={() => setIsIdeaModalOpen(true)}
                className="inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
              >
                Generate project ideas
                <span className="ml-2">💡</span>
              </button>
              <Link 
                href="/projects" 
                className="inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
              >
                Browse Projects
                <span className="ml-2">📈</span>
              </Link>
              <Link 
                href="/projects/new" 
                className="inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
              >
                Create Founder Card
                <span className="ml-2">🛠️</span>
              </Link>
              <Link 
                href="#" 
                className="inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 relative group"
              >
                Micro-Sprints
                <span className="ml-2">🚀</span>
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold transform rotate-12 group-hover:rotate-0 transition-transform duration-200">Soon</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center flex justify-center items-center text-sm text-gray-500 dark:text-gray-400 absolute bottom-10 left-0 right-0">
          Made by <Link href="https://x.com/crypto_yohann" target="_blank" rel="noopener noreferrer" className="text-meme-blue dark:text-meme-blue-light">&nbsp;crypto_yohann </Link>
          <a 
            href="https://x.com/beliefteamfun" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-[#000000] dark:text-[#FFFFFF] hover:text-[#1DA1F2] dark:hover:text-[#1DA1F2] transition-colors"
          >
            <span className="mx-2">•</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a 
            href="https://t.me/beliefteamdotfun" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-[#0088cc] hover:text-[#0088cc]/80 transition-colors"
          >
            <span className="mx-2">•</span>
            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>
        </div>
      </div>

      <IdeaGenerationModal 
        isOpen={isIdeaModalOpen}
        onClose={() => setIsIdeaModalOpen(false)}
      />
    </AnimatedBackground>
  );
}