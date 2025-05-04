import axios from 'axios';

export type Token = {
    author: string;
    coinName: string;
    tokenSymbol: string;
    tokenAddress: string;
    createdAt: number;
};

export async function getTokens(twitterHandle?: string): Promise<Token[]> {
    const queryParams = twitterHandle ? `?twitterHandle=${twitterHandle}` : '';
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/getBelieveTokens${queryParams}`);

    return response.data;
};