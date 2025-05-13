import { fetchTokens } from '../../lib/fetchTokens';
import BackButton from '../../components/BackButton';
import { useState, useMemo } from 'react';
import AnimatedBackground from '../../components/AnimatedBackground';

const TOKENS_PER_PAGE = 10;

export default function Projects() {
  const { tokens, loading } = fetchTokens();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlyWithMarketData, setShowOnlyWithMarketData] = useState(true);
  const [sortBy, setSortBy] = useState<'marketCap' | 'priceChange'>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: 'marketCap' | 'priceChange') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
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

    // Apply market data filter
    if (showOnlyWithMarketData) {
      filtered = filtered.filter(token => token.marketData?.marketCap);
    }

    // Sort by selected criteria
    return filtered.sort((a, b) => {
      if (sortBy === 'marketCap') {
        const aMarketCap = a.marketData?.marketCap || 0;
        const bMarketCap = b.marketData?.marketCap || 0;
        return sortDirection === 'asc' ? aMarketCap - bMarketCap : bMarketCap - aMarketCap;
      } else {
        const aPriceChange = a.marketData?.priceChange || 0;
        const bPriceChange = b.marketData?.priceChange || 0;
        return sortDirection === 'asc' ? aPriceChange - bPriceChange : bPriceChange - aPriceChange;
      }
    });
  }, [tokens, searchQuery, showOnlyWithMarketData, sortBy, sortDirection]);

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

          {loading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin-slow rounded-full h-12 w-12 border-t-2 border-b-2 border-meme-blue"></div>
            </div>
          ) : (
            <>

              <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="w-full sm:w-96">
                  <input
                    type="text"
                    placeholder="Search by symbol, name, author, or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-meme-blue bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-meme-blue focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-3">
                <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={showOnlyWithMarketData}
                        onChange={(e) => setShowOnlyWithMarketData(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-meme-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-meme-blue"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 group-hover:text-meme-blue transition-colors">
                        Show only projects with market data
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-2xl overflow-hidden shadow-meme bg-white">
                  <thead className="bg-gradient-to-r from-meme-blue to-meme-blue-accent sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-[150px] min-w-[150px]">Symbol</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-[200px] min-w-[200px] max-w-[200px] truncate">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-[120px] min-w-[120px] max-w-[120px] truncate">Author</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-[220px] min-w-[220px] max-w-[220px]">Contract Address</th>
                      <th
                        className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider w-[120px] min-w-[90px] cursor-pointer hover:bg-meme-blue-dark transition-colors"
                        onClick={() => handleSort('marketCap')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Market Cap
                          {sortBy === 'marketCap' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {sortDirection === 'asc' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              )}
                            </svg>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider w-[120px] min-w-[90px] cursor-pointer hover:bg-meme-blue-dark transition-colors"
                        onClick={() => handleSort('priceChange')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          24H
                          {sortBy === 'priceChange' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {sortDirection === 'asc' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              )}
                            </svg>
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider w-[120px] min-w-[90px]">Chart</th>
                      <th className="px-4 py-3 w-[120px] min-w-[90px]"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedTokens.map((token, idx) => (
                      <tr key={token.tokenAddress} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-meme-blue-muted'} hover:bg-meme-blue-muted/50 transition-colors`}>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-meme-blue w-[150px] min-w-[150px]">
                            {token.tokenSymbol ? `$${token.tokenSymbol} ` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 w-[200px] min-w-[200px] truncate max-w-[200px]">{token.coinName ? token.coinName : '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-meme-blue w-[120px] min-w-[120px] max-w-[120px] truncate">
                          <a href={`https://x.com/${token.author}`} target="_blank" rel="noopener noreferrer" className="hover:text-meme-blue-dark transition-colors">
                            @{token.author}
                          </a>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 w-[220px] min-w-[220px] max-w-[220px]">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{token.tokenAddress}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(token.tokenAddress)}
                              className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-meme-blue text-white hover:bg-meme-blue-dark transition-colors shadow-sm"
                              aria-label="Copy address"
                              title="Copy address to clipboard"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-meme-blue-dark w-[120px] min-w-[90px]">
                          {token.marketData?.marketCap ? `${formatMarketCap(token.marketData.marketCap)}` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-meme-blue-dark w-[120px] min-w-[90px]">
                          {token.marketData?.priceChange ? token.marketData.priceChange > 0 ? `+${token.marketData.priceChange}%` : `-${token.marketData.priceChange}%` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center w-[120px] min-w-[90px]">
                          <a
                            href={`https://dexscreener.com/solana/${token.tokenAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                            title="View Chart on Dexscreener"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </a>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap w-[120px] min-w-[90px]">
                            <a
                              href={`/founder-card/${token.tokenAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-meme-blue/90 to-meme-blue-accent/90 text-white text-xs font-semibold overflow-hidden transition-all duration-300 hover:shadow-meme-glow"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-meme-blue to-meme-blue-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative flex items-center gap-2">
                                <svg className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">Card</span>
                              </div>
                              <div className="absolute inset-0 border border-white/20 rounded-xl"></div>
                            </a>
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

      </AnimatedBackground>
    </div>
  );
}