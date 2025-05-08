import Link from "next/link";
import Head from 'next/head';
import AnimatedBackground from "../components/AnimatedBackground";
import { useEffect, useState } from "react";
import axios from "axios";
import IdeaGenerationModal from "../components/IdeaGenerationModal";

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
          <link rel="icon" href="/beliefteam_logo.png" />
        </Head>
        {/* Buy Token Button */}
        <div className="absolute top-4 right-4">
          <a 
            href="https://jup.ag/tokens/DddnaQ3Vtr829Scjk7WW8y6r5EBq9aarnfaz2FZ6dss9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            Buy $BELIEFTEAM
          </a>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Belief</span>
              <span className="block text-meme-blue">Team</span>
            </h1>
            
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-20 md:text-xl md:max-w-3xl animate-bounce">
              Connect builders & believers in the tokenized idea economy
            </p>
            <div className="mt-20 grid grid-cols-2 gap-4 max-w-3xl mx-auto">
            <button 
                onClick={() => setIsIdeaModalOpen(true)}
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
              >
                Generate project ideas
                <span className="ml-2">💡</span>
              </button>
              <Link 
                href="/projects" 
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
              >
                Browse Projects
                <span className="ml-2">📈</span>
              </Link>
              <Link 
                href="/projects/new" 
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
              >
                Post Your Believe project needs
                <span className="ml-2">🛠️</span>
              </Link>
              <Link 
                href="#" 
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 relative group"
              >
                Micro-Sprints
                <span className="ml-2">🚀</span>
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold transform rotate-12 group-hover:rotate-0 transition-transform duration-200">Soon</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 absolute bottom-10 left-0 right-0">Made by <Link href="https://x.com/crypto_yohann" target="_blank" rel="noopener noreferrer" className="text-meme-blue">crypto_yohann</Link></div>
      </div>

      <IdeaGenerationModal 
        isOpen={isIdeaModalOpen}
        onClose={() => setIsIdeaModalOpen(false)}
      />
    </AnimatedBackground>
  );
}