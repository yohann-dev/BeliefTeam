export  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) {
      return (marketCap / 1000000000).toFixed(2) + 'B';
    } else if (marketCap >= 1000000) {
      return (marketCap / 1000000).toFixed(2) + 'M';
    } else {
      return (marketCap / 1000).toFixed(0) + 'K';
    }
  };