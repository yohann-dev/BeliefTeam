import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function FounderCardRedirect() {
    const router = useRouter();
    const { tokenAddress } = router.query;

    useEffect(() => {
        if (tokenAddress) {
            router.replace(`/founder-card/${tokenAddress}`);
        }
    }, [tokenAddress, router]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-meme-blue mx-auto"></div>
                <p className="mt-4 text-gray-600">Redirecting to founder card...</p>
            </div>
        </div>
    );
} 