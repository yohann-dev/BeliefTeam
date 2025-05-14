import { formatMarketCap } from "../lib/utils";
import { Token } from "../pages/api/tokens/tokens.api";
import { FormData } from "../types/form";

interface FounderCardProps {
    token: Token;
    formData: FormData;
    isFounderCard?: boolean;
    isFounderConnected?: boolean;
    marketCap?: string;
    price?: string;
    priceChange?: string;
}

export default function FounderCard({ token, formData, isFounderCard = false, isFounderConnected = false, marketCap, price, priceChange }: FounderCardProps) {    
    const isFormEmpty = !formData || (
        !formData.tokenLogo &&
        !formData.projectLink &&
        !formData.description &&
        (!formData.needs || formData.needs.length === 0) &&
        !formData.extraInfo &&
        !formData.contactEmail &&
        !formData.demoLink &&
        (!formData.roadmap || formData.roadmap.length === 0)
    );

    const getShareButtonText = () => {
        if (isFounderConnected) {
            return `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🚀 Just dropped a Founder Card for $${token.tokenSymbol}

🪪 Founder: @${token.author}
🧩 Looking for: ${formData.needs.join(', ')}
📍 Project: ${token.description}
🧭 Roadmap & links inside 👇

https://beliefteam.fun/f/${token.tokenAddress}`)}`;
        } else {
            return `https://twitter.com/intent/tweet?text=${encodeURIComponent(`@${token.author} launched $${token.tokenSymbol} on @believeapp

Find the project info here:
https://beliefteam.fun/f/${token.tokenAddress}`)}`;
        }
    }

    const shareButton = (
        <a
            href={getShareButtonText()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#1DA1F2] to-[#0D8ECF] text-white rounded-xl hover:from-[#1a94e0] hover:to-[#0c7db8] transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 text-sm sm:text-base"
        >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share
        </a>
    );

    const renderTokenInfo = () => (
        <div className="flex items-center gap-4">
            {(isFormEmpty ? token.tokenLogo : formData.tokenLogo) && (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-meme-blue shadow-lg">
                    <img 
                        src={isFormEmpty ? token.tokenLogo : formData.tokenLogo} 
                        alt={`${token.coinName} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64?text=!';
                            e.currentTarget.onerror = null;
                        }}
                    />
                </div>
            )}
            <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                    <span className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-meme-blue to-meme-blue-dark bg-clip-text text-transparent">
                        ${token.tokenSymbol}
                    </span>
                    <span 
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                            isFounderCard 
                                ? "bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/30 text-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                                : !isFormEmpty
                                    ? "bg-gradient-to-br from-gray-300/20 to-gray-400/20 border border-gray-300/30 text-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.15)]"
                                    : "bg-gradient-to-br from-meme-blue/20 to-meme-blue-dark/20 border border-meme-blue/30 text-meme-blue shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                        } cursor-help group relative`}
                        title={isFounderCard ? "Updated by Founder" : !isFormEmpty ? "Updated by Community" : "Token Info"}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none border border-gray-700/50">
                            {isFounderCard ? "Updated by Founder" : !isFormEmpty ? "Updated by Community" : "Token Info"}
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/95 rotate-45 border-r border-b border-gray-700/50"></span>
                        </span>
                    </span>
                </div>
                <div className="mt-3">
                    <a
                        href={`https://x.com/${token.author}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-meme-blue hover:text-meme-blue-dark transition-colors flex items-center gap-1.5 group"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span className="group-hover:underline">@{token.author}</span>
                    </a>
                </div>
            </div>
        </div>
    );

    const renderActionButtons = () => (
        <div className="flex flex-wrap gap-2">
            <a
                href={`https://dexscreener.com/solana/${token.tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 text-sm sm:text-base"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Chart
            </a>
            {shareButton}
        </div>
    );

    const renderMarketMetrics = () => (
        (marketCap || price || priceChange) && (
            <div className="flex flex-col gap-2 w-[100px] shrink-0">
                {price && (
                    <div className="bg-gray-50/50 rounded-lg p-1.5 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-0.5">Price</div>
                        <div className="text-sm font-medium text-gray-900">
                            ${price}
                        </div>
                    </div>
                )}
                {marketCap && (
                    <div className="bg-gray-50/50 rounded-lg p-1.5 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-0.5">Market Cap</div>
                        <div className="text-sm font-medium text-gray-900">
                            ${formatMarketCap(Number(marketCap))}
                        </div>
                    </div>
                )}
                {priceChange && (
                    <div className="bg-gray-50/50 rounded-lg p-1.5 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-0.5">24h Change</div>
                        <div className={`text-sm font-medium flex items-center gap-1 ${parseFloat(priceChange) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {parseFloat(priceChange) >= 0 ? (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                            {priceChange}%
                        </div>
                    </div>
                )}
            </div>
        )
    );

    const renderContent = () => (
        <div className="flex gap-8">
            <div className="flex-1">
                {/* Token Address */}
                <div className="mb-3 flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Token:</span>
                    <div className="flex items-center gap-1.5 bg-gray-50/50 px-2 py-1 rounded-lg border border-gray-100">
                        <code className="text-xs font-mono text-gray-600">{token.tokenAddress}</code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(token.tokenAddress);
                            }}
                            className="text-gray-400 hover:text-meme-blue transition-colors p-1"
                            title="Copy address"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Description */}
                {formData.description && (
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        About the Project
                    </h2>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{formData.description}</p>
                </div>
                )}

                {/* Team Needs */}
                {formData.needs.length > 0 && (
                    <div className="mb-8 sm:mb-12">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Looking for
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {formData.needs.map((need, index) => (
                                <span
                                    key={index}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-meme-blue/10 text-meme-blue rounded-xl text-xs sm:text-sm font-medium hover:bg-meme-blue/20 transition-colors duration-200"
                                >
                                    {need}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Roadmap */}
                {formData.roadmap.length > 0 && (
                    <div className="mb-8 sm:mb-12">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Roadmap
                        </h2>
                        <ul className="space-y-2 sm:space-y-3">
                            {formData.roadmap.map((item, index) => (
                                <li key={index} className="flex items-center gap-3 group">
                                    <div className="w-2 h-2 rounded-full bg-meme-blue group-hover:scale-150 transition-transform duration-200"></div>
                                    <span className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Demo Video */}
                {formData.demoLink && (
                    <div className="mb-8 sm:mb-12">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            Demo Video
                        </h2>
                        <a
                            href={formData.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-meme-blue hover:text-meme-blue-dark transition-colors group text-sm sm:text-base"
                        >
                            <span className="group-hover:underline">Watch Demo on Loom</span>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                )}

                {/* Additional Links */}
                {(formData.projectLink || formData.extraInfo) && (
                    <div className="mb-8 sm:mb-12">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Additional Links
                        </h2>
                        <div className="space-y-2 sm:space-y-3">
                            {formData.projectLink && (
                                <a
                                    href={formData.projectLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-meme-blue hover:text-meme-blue-dark transition-colors group text-sm sm:text-base"
                                >
                                    <span className="group-hover:underline">Project Link</span>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            )}
                            {formData.extraInfo && (
                                <div className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{formData.extraInfo}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Contact */}
                {formData.contactEmail && (
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact
                        </h2>
                        <a
                            href={`mailto:${formData.contactEmail}`}
                            className="inline-flex items-center gap-2 text-meme-blue hover:text-meme-blue-dark transition-colors group text-sm sm:text-base"
                        >
                            <span className="group-hover:underline">{formData.contactEmail}</span>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                )}
            </div>

            {renderMarketMetrics()}
        </div>
    );

    const renderUnlockMessage = () => (
        <div className="text-center py-8 px-6 mt-6 bg-gradient-to-br from-meme-blue/5 via-transparent to-meme-blue/5 rounded-xl border border-meme-blue/10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-meme-blue to-meme-blue-dark bg-clip-text text-transparent mb-3">
                Founder's Vision Coming Soon! 🚀
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-base leading-relaxed">
                This founder may be crafting something special.
            </p>
            <div className="flex flex-col items-center gap-4">
                {!isFormEmpty && <p className="text-meme-blue font-medium text-sm">
                    This card has been edited by {!isFounderCard ? "the community" : "the founder"}
                </p>
                }

                <a href='/projects/new' rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-meme-blue to-meme-blue-dark text-white rounded-xl hover:from-meme-blue-dark hover:to-meme-blue transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 text-sm font-medium group">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">Edit Card</span>
                </a>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-meme p-4 sm:p-8 max-w-3xl mx-auto transform transition-all duration-300 hover:shadow-meme-glow mt-16 sm:mt-0 border border-gray-100/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-meme-blue/5 via-transparent to-meme-blue/5 pointer-events-none"></div>
            <div className="absolute inset-0 border border-meme-blue/10 rounded-2xl pointer-events-none"></div>
            <div className="relative">
                {/* Header with Token Info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0 mb-8 sm:mb-6">
                    <div className="space-y-2">
                        {renderTokenInfo()}
                    </div>
                    {renderActionButtons()}
                </div>

                {renderContent()}
                {!isFounderCard && renderUnlockMessage()}
            </div>
        </div>
    );
} 