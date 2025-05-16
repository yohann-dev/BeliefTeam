import { useEffect, useState } from "react";
import { Token, getTokens, getTokensLastUpdatedDate } from "../pages/api/tokens/tokens.api";


export function fetchTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>('');
  useEffect(() => {
    const fetch = async () => {
      try {
        const tokensData = await getTokens();
        const lastUpdatedDate = await getTokensLastUpdatedDate();
        setTokens(tokensData);
        setLastUpdatedDate(lastUpdatedDate);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { tokens, loading, lastUpdatedDate };
}