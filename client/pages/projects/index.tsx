import { fetchTokens } from '../../lib/fetchTokens';
import BackButton from '../../components/BackButton';
import { useState, useMemo } from 'react';
import { Token } from '../api/tokens/tokens.api';
import AnimatedBackground from '../../components/AnimatedBackground';

const TOKENS_PER_PAGE = 10;

export default function Projects() {
  const { tokens, loading } = fetchTokens();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlyWithDetails, setShowOnlyWithDetails] = useState(false);

  const hasAdditionalInfo = (token: Token) => {
    return Boolean(
      token.description ||
      token.needs?.length ||
      token.tweetLink ||
      token.extraInfo ||
      token.contactEmail
    );
  };

  const filteredTokens = useMemo(() => {
    let filtered = tokens;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(token =>
        token.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.coinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.tokenAddress.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply details filter
    if (showOnlyWithDetails) {
      filtered = filtered.filter(hasAdditionalInfo);
    }

    // Sort by holder count
    return filtered.sort((a, b) => {
      const aHolders = a.marketData?.holderCount || 0;
      const bHolders = b.marketData?.holderCount || 0;
      return bHolders - aHolders;
    });
  }, [tokens, searchQuery, showOnlyWithDetails]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTokens.length / TOKENS_PER_PAGE);
  const paginatedTokens = filteredTokens.slice(
    (currentPage - 1) * TOKENS_PER_PAGE,
    currentPage * TOKENS_PER_PAGE
  );

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) {
      return (marketCap / 1000000000).toFixed(2) + 'B';
    } else if (marketCap >= 1000000) {
      return (marketCap / 1000000).toFixed(2) + 'M';
    } else {
      return (marketCap / 1000).toFixed(0) + 'K';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-meme-blue-muted py-12 px-4 sm:px-6 lg:px-8 relative">
      <AnimatedBackground>
        <BackButton />

        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-center">
              <span className="block text-gray-900">Browse</span>
              <span className="block text-meme-blue animate-pulse-slow">Believe Projects</span>
            </h1>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="w-full sm:w-96">
              <input
                type="text"
                placeholder="Search by symbol, name, author, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-meme-blue bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-meme-blue focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowOnlyWithDetails(!showOnlyWithDetails)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                showOnlyWithDetails
                  ? 'bg-meme-blue text-white shadow-meme-glow'
                  : 'bg-white text-meme-blue border-2 border-meme-blue hover:bg-meme-blue hover:text-white'
              }`}
            >
              {showOnlyWithDetails ? 'Show All Projects' : 'Show Only Projects with Details'}
            </button>
          </div>

          {loading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin-slow rounded-full h-12 w-12 border-t-2 border-b-2 border-meme-blue"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-2xl overflow-hidden shadow-meme bg-white">
                  <thead className="bg-gradient-to-r from-meme-blue to-meme-blue-accent sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-[150px] min-w-[150px]">Symbol</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-[200px] min-w-[200px] max-w-[200px] truncate">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-[120px] min-w-[120px] max-w-[120px] truncate">Author</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-[220px] min-w-[220px] max-w-[220px]">Contract Address</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider w-[120px] min-w-[90px]">Market Cap</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider w-[120px] min-w-[90px]">Holders</th>
                      <th className="px-4 py-3 w-[120px] min-w-[90px]"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedTokens.map((token, idx) => (
                      <tr key={token.tokenAddress} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-meme-blue-muted'} hover:bg-meme-blue-muted/50 transition-colors`}>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-meme-blue w-[150px] min-w-[150px]">
                          <a href={`https://believe.app/coin/${token.tokenAddress}`} target="_blank" rel="noopener noreferrer" className="hover:text-meme-blue-dark transition-colors">
                            {token.tokenSymbol && `$${token.tokenSymbol} `}
                          </a>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 w-[200px] min-w-[200px] truncate max-w-[200px]">{token.coinName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-meme-blue w-[120px] min-w-[120px] max-w-[120px] truncate">
                          <a href={`https://x.com/${token.author}`} target="_blank" rel="noopener noreferrer" className="hover:text-meme-blue-dark transition-colors">
                            @{token.author}
                          </a>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 w-[220px] min-w-[220px] max-w-[220px] truncate">
                          {token.tokenAddress}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-meme-blue-dark w-[120px] min-w-[90px]">
                          {token.marketData?.marketCap ? `${formatMarketCap(token.marketData.marketCap)}` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-meme-blue-dark w-[120px] min-w-[90px]">
                          {token.marketData?.holderCount?.toLocaleString() || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap w-[120px] min-w-[90px]">
                          {hasAdditionalInfo(token) && (
                            <button
                              onClick={() => setSelectedToken(token)}
                              className="px-3 py-1 rounded-xl bg-gradient-to-r from-meme-blue to-meme-blue-accent text-white text-xs font-semibold hover:shadow-meme-glow transition-all duration-300"
                            >
                              View Details
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white text-meme-blue border-2 border-meme-blue font-semibold hover:bg-meme-blue hover:text-white transition-colors disabled:opacity-50"
                  aria-label="Previous page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-meme-blue font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white text-meme-blue border-2 border-meme-blue font-semibold hover:bg-meme-blue hover:text-white transition-colors disabled:opacity-50"
                  aria-label="Next page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Token Details Modal */}
        {selectedToken && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-meme-glow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedToken.coinName}</h2>
                  <p className="text-meme-blue font-medium">${selectedToken.tokenSymbol}</p>
                </div>
                <button
                  onClick={() => setSelectedToken(null)}
                  className="text-gray-400 hover:text-meme-blue transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-meme-blue">Contract Address</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedToken.tokenAddress}</p>
                </div>

                {selectedToken.description && (
                  <div>
                    <h3 className="text-sm font-medium text-meme-blue">Description</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedToken.description}</p>
                  </div>
                )}

                {selectedToken.needs && selectedToken.needs.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-meme-blue">Project Needs</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedToken.needs.map((need, index) => (
                        <span key={index} className="px-3 py-1 text-sm font-medium text-meme-blue bg-meme-blue-muted rounded-full border border-meme-blue">
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedToken.tweetLink && (
                  <div>
                    <h3 className="text-sm font-medium text-meme-blue">Project Tweet</h3>
                    <a
                      href={selectedToken.tweetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-meme-blue hover:text-meme-blue-dark transition-colors"
                    >
                      View on X/Twitter
                    </a>
                  </div>
                )}

                {selectedToken.contactEmail && (
                  <div>
                    <h3 className="text-sm font-medium text-meme-blue">Contact Email</h3>
                    <a
                      href={`mailto:${selectedToken.contactEmail}`}
                      className="mt-1 text-sm text-meme-blue hover:text-meme-blue-dark transition-colors"
                    >
                      {selectedToken.contactEmail}
                    </a>
                  </div>
                )}

                {selectedToken.extraInfo && (
                  <div>
                    <h3 className="text-sm font-medium text-meme-blue">Additional Information</h3>
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