import axios from 'axios';

export type Token = {
    author: string;
    coinName: string;
    tokenSymbol: string;
    tokenAddress: string;
    createdAt: number;
};

export async function getTokens(): Promise<Token[]> {
    const response = await axios.get('http://localhost:3000/api/get-believe-tokens');

    return response.data;
};