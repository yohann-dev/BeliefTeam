import { fetchTokens } from '../../lib/fetchTokens';
import BackButton from '../../components/BackButton';
import { useState, useMemo } from 'react';
import { Token } from '../api/tokens/tokens.api';
import AnimatedBackground from '../../components/AnimatedBackground';

export default function Projects() {
  const { tokens, loading } = fetchTokens();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = useMemo(() => {
    if (!searchQuery) return tokens;
    return tokens.filter(token =>
      token.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.coinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.tokenAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tokens, searchQuery]);

  const hasAdditionalInfo = (token: Token) => {
    return Boolean(
      token.description ||
      token.needs?.length ||
      token.tweetLink ||
      token.extraInfo ||
      token.contactEmail
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AnimatedBackground>
        <BackButton />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Believe</span>
              <span className="block text-meme-blue">Projects</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover the latest believe projects and join the movement
            </p>
          </div>

          {/* Search Bar */}

          <div className="absolute top-10 right-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-meme-blue focus:border-transparent transition-all"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          { loading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meme-blue"></div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTokens.map(token => (
              <div key={token.tokenAddress} className="bg-white rounded-2xl shadow-meme p-6 transform transition-all hover:scale-105 hover:shadow-lg h-[240px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{token.coinName}</h3>
                  <span className="px-3 py-1 text-sm font-semibold text-meme-blue bg-meme-blue bg-opacity-10 rounded-full">
                    <a href={"https://believe.app/coin/" + token.tokenAddress} target="_blank" rel="noopener noreferrer">
                      ${token.tokenSymbol}
                    </a>
                  </span>
                </div>

                <div className="space-y-3 flex-grow">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="truncate">
                      Launched by {' '}
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
                    <button
                      onClick={() => navigator.clipboard.writeText(token.tokenAddress)}
                      className="ml-2 text-meme-blue hover:text-meme-blue-dark"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>

                  {token.marketData && (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="truncate">
                        Price: ${token.marketData.price} | Market Cap: ${token.marketData.marketCap} | Holders: {token.marketData.holderCount}
                      </span>
                    </div>
                  )}
                </div>

                {hasAdditionalInfo(token) && (
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedToken(token)}
                      className="w-full px-4 py-2 text-sm font-medium text-meme-blue hover:text-meme-blue-dark hover:bg-meme-blue hover:bg-opacity-5 rounded-xl transition-colors"
                    >
                      View Project Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Token Details Modal */}
        {selectedToken && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedToken.coinName}</h2>
                  <p className="text-meme-blue font-medium">${selectedToken.tokenSymbol}</p>
                </div>
                <button
                  onClick={() => setSelectedToken(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contract Address</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedToken.tokenAddress}</p>
                </div>

                {selectedToken.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedToken.description}</p>
                  </div>
                )}

                {selectedToken.needs && selectedToken.needs.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Project Needs</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedToken.needs.map((need, index) => (
                        <span key={index} className="px-3 py-1 text-sm font-medium text-meme-blue bg-meme-blue bg-opacity-10 rounded-full">
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedToken.tweetLink && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Project Tweet</h3>
                    <a
                      href={selectedToken.tweetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-meme-blue hover:text-meme-blue-dark"
                    >
                      View on X/Twitter
                    </a>
                  </div>
                )}

                {selectedToken.contactEmail && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
                    <a
                      href={`mailto:${selectedToken.contactEmail}`}
                      className="mt-1 text-sm text-meme-blue hover:text-meme-blue-dark"
                    >
                      {selectedToken.contactEmail}
                    </a>
                  </div>
                )}

                {selectedToken.extraInfo && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedToken.extraInfo}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatedBackground>
    </div>
  );
}