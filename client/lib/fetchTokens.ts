import { useEffect, useState } from "react";
import { Token, getTokens } from "../pages/api/tokens/tokens.api";


export function fetchTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const tokensData = await getTokens();
        setTokens(tokensData);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { tokens, loading };
}