import { fetchTokens } from '../../lib/fetchTokens';
import BackButton from '../../components/BackButton';

export default function Projects() {
  const { tokens, loading } = fetchTokens();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meme-blue"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <BackButton />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Believe</span>
            <span className="block text-meme-blue">Tokens</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover the latest believe projects and join the movement
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tokens.map(token => (
            <div key={token.tokenAddress} className="bg-white rounded-2xl shadow-meme p-6 transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{token.coinName}</h3>
                <span className="px-3 py-1 text-sm font-semibold text-meme-blue bg-meme-blue bg-opacity-10 rounded-full">
                  ${token.tokenSymbol}
                </span>
              </div>
              
              <div className="space-y-3">
                
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="truncate">
                    Created by {' '}
                    <a 
                      href={`https://x.com/${token.author}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-meme-blue hover:text-meme-blue-dark"
                    >
                       @{token.author}
                    </a>
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="truncate">CA: {token.tokenAddress}</span>
                </div>
                
                {/* <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {token.createdAt ? new Date(token.createdAt * 1000).toLocaleString() : 'Unknown time'}
                </div> */}

                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <a 
                    href={`https://believe.app/${token.tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-meme-blue hover:text-meme-blue-dark"
                  >
                    View on BelieveApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}