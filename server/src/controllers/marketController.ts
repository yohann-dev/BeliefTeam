import axios from "axios"

export const marketController = {

    getBelieveDataFiltered(data: any) {
        const mapData = new Map();

        data.recent.pools.forEach((pool: any) => {
            mapData.set(pool.id, {
                price: pool.baseAsset.usdPrice,
                holderCount: pool.baseAsset.holderCount,
                marketCap: pool.baseAsset.mcap,
            });
        });

        data.graduated.pools.forEach((pool: any) => {
            mapData.set(pool.id, {
                price: pool.baseAsset.usdPrice,
                holderCount: pool.baseAsset.holderCount,
                marketCap: pool.baseAsset.mcap,
            });
        });

        data.aboutToGraduate.pools.forEach((pool: any) => {
            mapData.set(pool.id, {
                price: pool.baseAsset.usdPrice?.toFixed(2),
                holderCount: pool.baseAsset.holderCount,
                marketCap: pool.baseAsset.mcap?.toFixed(0),
            });
        });

        return mapData;
    },

    async getBelieveMarketData() {
        const believeMarketData = await axios.post(
            'https://datapi.jup.ag/v1/pools/gems',
            {
                "recent": {
                    "timeframe": "24h",
                    "launchpads": [
                        "Believe"
                    ]
                },
                "graduated": {
                    "timeframe": "24h",
                    "launchpads": [
                        "Believe"
                    ]
                },
                "aboutToGraduate": {
                    "timeframe": "24h",
                    "launchpads": [
                        "Believe"
                    ]
                }
            }, {
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const filterData = this.getBelieveDataFiltered(believeMarketData.data);

        return filterData;
    }
}