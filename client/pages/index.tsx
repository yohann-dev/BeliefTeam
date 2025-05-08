import Link from "next/link";
import Head from 'next/head';
import { useEffect, useState } from "react";
import axios from "axios";
import BoostProjectModal from "../components/BoostProjectModal";

export default function Home() {
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);

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
    <div>
      <Head>
        <link rel="icon" href="/beliefteam_logo.png" />
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Belief</span>
            <span className="block text-meme-blue">Team</span>
          </h1>
          
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-20 md:text-xl md:max-w-3xl animate-bounce">
            Connect builders & believers in the tokenized idea economy
          </p>

          <div className="mt-20 flex justify-center space-x-4">
            <Link 
              href="/projects/new" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-meme-blue hover:bg-meme-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meme-blue transition-all duration-200"
            >
              Post Your Believe project needs
            </Link>
            <Link 
              href="/projects" 
              className="inline-flex items-center px-6 py-3 border border-meme-blue text-base font-medium rounded-xl text-meme-blue bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meme-blue transition-all duration-200"
            >
              Browse Projects
            </Link>
            <button 
              onClick={() => setIsBoostModalOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 hover:from-orange-600 hover:via-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 relative group"
            >
              Boost a project
            </button>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 absolute bottom-10 left-0 right-0">Support (SOL): 7WTMAK8Jb7JszSMDWSCa7g4dWN2zhoYKTat7Y4PsssHd</div>

      <BoostProjectModal 
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
      />
    </div>
  );
}