import { useEffect, useState } from 'react';
import axios from 'axios';
import { Token } from '../pages/api/tokens/tokens.api';

export default function BoostedProjectsBanner() {
  const [boostedProjects, setBoostedProjects] = useState<Token[]>([]);

  useEffect(() => {
    const fetchBoostedProjects = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/boosted`);
        setBoostedProjects(response.data);
      } catch (error) {
        console.error('Error fetching boosted projects:', error);
      }
    };
    fetchBoostedProjects();
  }, []);

  if (boostedProjects.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#0066FF] via-[#0047B3] to-[#0066FF] py-4">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="flex space-x-4 min-w-max">
            {boostedProjects.map((project, index) => (
              <div key={project.tokenAddress + index} className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-meme-glow border border-white/10">
                <div className="flex items-center space-x-4">
                  <span className="text-white/90 font-medium flex items-center">
                    <span className="text-orange-400 mr-1.5">🔥</span>
                    Boosted
                  </span>
                  <div className="h-4 w-px bg-white/20"></div>
                  <span className="text-white font-bold tracking-wide">${project.tokenSymbol}</span>
                  <a
                    className="text-white/80 hover:text-white font-medium transition-colors duration-200"
                    href={`https://x.com/${project.author}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    by @{project.author}
                  </a>
                  <div className="h-4 w-px bg-white/20"></div>
                  <a
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200 flex items-center"
                    href={`https://jup.ag/tokens/${project.tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}