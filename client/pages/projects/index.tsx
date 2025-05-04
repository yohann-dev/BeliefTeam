import { fetchTokens } from '../../lib/fetchTokens';
import BackButton from '../../components/BackButton';
import { useState } from 'react';
import { Token } from '../api/tokens/tokens.api';

export default function Projects() {
  const { tokens, loading } = fetchTokens();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meme-blue"></div>
    </div>
  );

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
            <div key={token.tokenAddress} className="bg-white rounded-2xl shadow-meme p-6 transform transition-all hover:scale-105 hover:shadow-lg h-[240px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{token.coinName}</h3>
                <span className="px-3 py-1 text-sm font-semibold text-meme-blue bg-meme-blue bg-opacity-10 rounded-full">
                  ${token.tokenSymbol}
                </span>
              </div>
              
              <div className="space-y-3 flex-grow">
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
              </div>

              {hasAdditionalInfo(token) && (
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedToken(token)}
                    className="w-full px-4 py-2 text-sm font-medium text-meme-blue hover:text-meme-blue-dark hover:bg-meme-blue hover:bg-opacity-5 rounded-xl transition-colors"
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
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
    </div>
  );
}