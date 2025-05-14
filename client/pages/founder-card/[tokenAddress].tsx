import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { Token } from '../api/tokens/tokens.api';
import { FormData } from '../../types/form';
import FounderCard from '../../components/FounderCard';
import AnimatedBackground from '../../components/AnimatedBackground';
import BackButton from '../../components/BackButton';
import { useTwitterSession } from '../../hooks/useTwitterSession';
export default function FounderCardPage() {
    const router = useRouter();
    const { tokenAddress } = router.query;
    const { twitterHandle } = useTwitterSession();
    const [token, setToken] = useState<Token | null>(null);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFounderCard, setIsFounderCard] = useState(false);
    const [isFounderConnected, setIsFounderConnected] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
            if (!tokenAddress) return;

            try {
                setLoading(true);
                const response = await axiosInstance.get(`/api/getBelieveToken?tokenAddress=${tokenAddress}`);
                const tokenData = response.data;

                if (!tokenData || (Array.isArray(tokenData) && tokenData.length === 0)) {
                    setError('Founder card not created yet');
                    return;
                }

                // Transform token data into FormData format
                const formData: FormData = {
                    tokenAddress: tokenData.tokenAddress,
                    projectLink: tokenData.projectLink || '',
                    description: tokenData.description || '',
                    needs: tokenData.needs || [],
                    extraInfo: tokenData.extraInfo || '',
                    contactEmail: tokenData.contactEmail || '',
                    demoLink: tokenData.demoLink || '',
                    roadmap: tokenData.roadmap || [],
                    tokenLogo: tokenData.tokenLogo || '',
                };

                setToken(tokenData);
                setFormData(formData);
                setIsFounderCard(tokenData.isFounderCard);
                setIsFounderConnected(tokenData.author === twitterHandle);
            } catch (err) {
                console.error('Error fetching token:', err);
                setError('Failed to load token data');
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, [tokenAddress]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
                <AnimatedBackground>
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-meme-blue mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading founder card...</p>
                    </div>
                </AnimatedBackground>
            </div>
        );
    }

    if (error || !token || !formData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
                <AnimatedBackground>
                    <BackButton path="/projects" text="Projects" />
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {error || 'Founder card not found'}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {error === 'Founder card not created yet' 
                                ? 'This founder card has not been created yet. Create one to share your vision with the community!'
                                : 'We couldn\'t find the founder card you\'re looking for.'}
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="/projects"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-meme-blue hover:bg-meme-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meme-blue transition-colors"
                            >
                                Back to Projects
                            </a>
                            {error === 'Founder card not created yet' && (
                                <a
                                    href="/projects/new"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-meme-blue hover:bg-meme-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meme-blue transition-colors"
                                >
                                    Create Founder Card
                                </a>
                            )}
                        </div>
                    </div>
                </AnimatedBackground>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            <AnimatedBackground>
                <BackButton path="/projects" text="To Projects" />
                <FounderCard
                    token={token}
                    formData={formData}
                    isFounderCard={isFounderCard}
                    isFounderConnected={isFounderConnected}
                    marketCap={token.marketData?.marketCap}
                    price={token.marketData?.price}
                    priceChange={token.marketData?.priceChange}
                    />
            </AnimatedBackground>
        </div>
    );
} 