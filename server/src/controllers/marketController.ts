import axios from "axios";
import { env } from "../config/env";

let cachedMarketData: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000;

export const marketController = {

    getBelieveDataFiltered(data: any) {
        const mapData = new Map();

        const addDataToMap = (data: any) => {
            data.pools.forEach((pool: any) => {
                mapData.set(pool.baseAsset.id, {
                    price: pool.baseAsset.usdPrice?.toFixed(2),
                    holderCount: pool.baseAsset.holderCount,
                    marketCap: pool.baseAsset.mcap?.toFixed(0),
                });
            });
        };

        addDataToMap(data.recent);
        addDataToMap(data.aboutToGraduate);
        addDataToMap(data.graduated);

        return mapData;
    },

    async getBelieveMarketData() {
        const now = Date.now();
        if (cachedMarketData && (now - cacheTimestamp < CACHE_DURATION_MS)) {
            return cachedMarketData;
        }

        const params = {
            "timeframe": "24h",
            "launchpads": [
                "Believe"
            ]
        };

        const believeMarketData = await axios.post(
            'https://datapi.jup.ag/v1/pools/gems',
            {
                "recent": params,
                "graduated": params,
                "aboutToGraduate": params
            }, {
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const filterData = this.getBelieveDataFiltered(believeMarketData.data);

        // Caching
        cachedMarketData = filterData;
        cacheTimestamp = now;

        return filterData;
    },

    async getBirdEyeMarketData(tokenAddresses: string[]) {
        const queryParams = new URLSearchParams();
        const MAX_ADDRESS_PER_REQUEST = 100;
        const MAX_REQUESTS_PER_SECOND = 15;
        let requestsPerSecond = 0;
        const birdeyeMarketData = new Map();
        const now = Date.now();
        if (cachedMarketData && (now - cacheTimestamp < CACHE_DURATION_MS)) {
            return cachedMarketData;
        }

        for (let i = 0; i < tokenAddresses.length; i += MAX_ADDRESS_PER_REQUEST) {  
            const batch = tokenAddresses.slice(i, i + MAX_ADDRESS_PER_REQUEST);
            queryParams.set('list_address', batch.join(','));
            const response = await axios.get(`https://public-api.birdeye.so/defi/multi_price?${queryParams.toString()}`, {
                headers: {
                    'X-API-KEY': `${env.BIRDEYE_API_KEY}`
                }
            });
            requestsPerSecond++;

            for (const [address, data] of Object.entries(response.data.data)) {
                if (typeof data === 'object' && data !== null) {
                    const { value, priceChange24h } = data as { value: number, priceChange24h: number };
                    birdeyeMarketData.set(address, {
                        price: value?.toFixed(4),
                        marketCap: (value * 1000000000)?.toFixed(0),
                        priceChange: priceChange24h?.toFixed(0)
                    });
                }
            }

            if (requestsPerSecond >= MAX_REQUESTS_PER_SECOND) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                requestsPerSecond = 0;
            }
        }
        
        // Caching
        cachedMarketData = birdeyeMarketData;
        cacheTimestamp = now;
        
        return birdeyeMarketData;
    },

    async getMissingTokenData(tokenAddress: string) {
        const response = await axios.get(`https://public-api.birdeye.so/defi/v3/token/meta-data/single?address=${tokenAddress}`, {
            headers: {
                'X-API-KEY': `${env.BIRDEYE_API_KEY}`
            }
        });

        if (!response.data.data) {
            return null;
        }

        const tokenData = {
            symbol: response.data.data.symbol,
            name: response.data.data.name,
            tokenLogo: response.data.data.logo_uri,
        }

        return tokenData;
    }
}