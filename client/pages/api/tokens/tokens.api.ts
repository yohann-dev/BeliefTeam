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
    tweetLink?: string;
    contactEmail?: string;
    marketData?: {
        marketCap: number;
        price: number;
        holderCount: number;
    }
};

export async function getTokens(): Promise<Token[]> {
    const response = await axiosInstance.get('/api/getBelieveTokens');
    return response.data;
}

export async function getTokensByTwitterHandle(twitterHandle: string): Promise<Token[]> {
    const response = await axiosInstance.get(`/api/getBelieveTokens?twitterHandle=${twitterHandle}`);
    return response.data;
}