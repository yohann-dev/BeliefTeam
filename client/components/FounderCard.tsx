import { Token } from "../pages/api/tokens/tokens.api";
import { FormData } from "../types/form";

interface FounderCardProps {
    token: Token;
    formData: FormData;
}

export default function FounderCard({ token, formData }: FounderCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-meme p-8 max-w-3xl mx-auto transform transition-all duration-300 hover:shadow-meme-glow">
            {/* Header with Token Info */}
            <div className="flex items-start justify-between mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{token.coinName}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-semibold bg-gradient-to-r from-meme-blue to-meme-blue-dark bg-clip-text text-transparent">
                            ${token.tokenSymbol}
                        </span>
                        <a 
                            href={`https://x.com/${token.author}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-meme-blue hover:text-meme-blue-dark transition-colors flex items-center gap-1.5 group"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <span className="group-hover:underline">@{token.author}</span>
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={`https://dexscreener.com/solana/${token.tokenAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        View Chart
                    </a>
                    <a
                        href={`https://twitter.com/intent/tweet?text=Check out ${token.coinName} ($${token.tokenSymbol}) on Belief Team!&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1DA1F2] to-[#0D8ECF] text-white rounded-xl hover:from-[#1a94e0] hover:to-[#0c7db8] transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Share
                    </a>
                </div>
            </div>

            {/* Description */}
            <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About the Project
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{formData.description}</p>
            </div>

            {/* Team Needs */}
            {formData.needs.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Looking for
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {formData.needs.map((need, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-meme-blue/10 text-meme-blue rounded-xl text-sm font-medium hover:bg-meme-blue/20 transition-colors duration-200"
                            >
                                {need}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Roadmap */}
            {formData.roadmap.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Roadmap
                    </h2>
                    <ul className="space-y-3">
                        {formData.roadmap.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 group">
                                <div className="mt-1.5">
                                    <div className="w-2 h-2 rounded-full bg-meme-blue group-hover:scale-150 transition-transform duration-200"></div>
                                </div>
                                <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Demo Video */}
            {formData.demoLink && (
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Demo Video
                    </h2>
                    <a
                        href={formData.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-meme-blue hover:text-meme-blue-dark transition-colors group"
                    >
                        <span className="group-hover:underline">Watch Demo on Loom</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            )}

            {/* Additional Links */}
            {(formData.tweetLink || formData.extraInfo) && (
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Additional Links
                    </h2>
                    <div className="space-y-3">
                        {formData.tweetLink && (
                            <a
                                href={formData.tweetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-meme-blue hover:text-meme-blue-dark transition-colors group"
                            >
                                <span className="group-hover:underline">Project Link</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        )}
                        {formData.extraInfo && (
                            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{formData.extraInfo}</div>
                        )}
                    </div>
                </div>
            )}

            {/* Contact */}
            {formData.contactEmail && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact
                    </h2>
                    <a
                        href={`mailto:${formData.contactEmail}`}
                        className="inline-flex items-center gap-2 text-meme-blue hover:text-meme-blue-dark transition-colors group"
                    >
                        <span className="group-hover:underline">{formData.contactEmail}</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            )}
        </div>
    );
} 