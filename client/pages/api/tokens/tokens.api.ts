import axiosInstance from '../../../lib/axios';

export type Token = {
    author: string;
    coinName: string;
    tokenSymbol: string;
    tokenAddress: string;
    createdAt: number;
    description?: string;
    extraInfo?: string;
    needs?: string[];
    projectLink?: string;
    contactEmail?: string;
    marketData?: {
        marketCap: string;
        price: string;
        priceChange: string;
    }
    isFounderCard?: boolean;
    demoLink?: string;
    roadmap?: string[];
    tokenLogo?: string;
};

export async function getTokens(): Promise<Token[]> {
    const response = await axiosInstance.get('/api/getBelieveTokens');
    return response.data;
}

export async function getTokensByTwitterHandle(twitterHandle: string, founderCardPage: boolean = false): Promise<Token[]> {
    const response = await axiosInstance.get(`/api/getBelieveTokens?twitterHandle=${twitterHandle}&founderCardPage=${founderCardPage}`);
    return response.data;
}