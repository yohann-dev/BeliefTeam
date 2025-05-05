import axios from "axios";

let cachedMarketData: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000;

export const marketController = {

    getBelieveDataFiltered(data: any) {
        const mapData = new Map();

        const addDataToMap = (data: any) => {
            data.pools.forEach((pool: any) => {
                mapData.set(pool.id, {
                    price: pool.baseAsset.usdPrice?.toFixed(2),
                    holderCount: pool.baseAsset.holderCount,
                    marketCap: pool.baseAsset.mcap?.toFixed(0),
                });
            });
        };

        addDataToMap(data.recent);
        addDataToMap(data.graduated);
        addDataToMap(data.aboutToGraduate);

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

        // Cache the result and timestamp
        cachedMarketData = filterData;
        cacheTimestamp = now;

        return filterData;
    }
}