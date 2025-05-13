import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { Token } from '../api/tokens/tokens.api';
import { FormData } from '../../types/form';
import FounderCard from '../../components/FounderCard';
import AnimatedBackground from '../../components/AnimatedBackground';
import BackButton from '../../components/BackButton';

export default function FounderCardPage() {
    const router = useRouter();
    const { tokenAddress } = router.query;
    const [token, setToken] = useState<Token | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    tweetLink: tokenData.tweetLink || '',
                    description: tokenData.description || '',
                    needs: tokenData.needs || [],
                    extraInfo: tokenData.extraInfo || '',
                    contactEmail: tokenData.contactEmail || '',
                    demoLink: tokenData.demoLink || '',
                    roadmap: tokenData.roadmap || [],
                };

                setToken(tokenData);
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

    if (error || !token) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
                <AnimatedBackground>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {error === 'Founder card not created yet' ? 'Founder Card Not Found' : 'Error'}
                        </h2>
                        <p className="text-gray-600">
                            {error === 'Founder card not created yet' 
                                ? 'This founder card has not been created yet. The project owner needs to create it first.'
                                : error || 'Token not found'
                            }
                        </p>
                        <div className="mt-6 space-x-4">
                            <button
                                onClick={() => router.push('/projects')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-meme-blue hover:bg-meme-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meme-blue"
                            >
                                Back to Projects
                            </button>
                            {error === 'Founder card not created yet' && (
                                <button
                                    onClick={() => router.push('/projects/new')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-meme-blue bg-meme-blue/10 hover:bg-meme-blue/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meme-blue"
                                >
                                    Create Founder Card
                                </button>
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
                <BackButton />
                <div className="max-w-3xl mx-auto">
                    <FounderCard 
                        token={token}
                        formData={{
                            tokenAddress: token.tokenAddress,
                            tweetLink: token.tweetLink || '',
                            description: token.description || '',
                            needs: token.needs || [],
                            extraInfo: token.extraInfo || '',
                            contactEmail: token.contactEmail || '',
                            demoLink: token.demoLink || '',
                            roadmap: token.roadmap || [],
                        }}
                    />
                </div>
            </AnimatedBackground>
        </div>
    );
} 