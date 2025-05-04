import { useEffect, useState } from "react";

export function useTwitterSession() {
  const [isLoading, setIsLoading] = useState(true);
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [twitterName, setTwitterName] = useState<string | null>(null);
  const [twitterAvatar, setTwitterAvatar] = useState<string | null>(null);
  const [twitterEmail, setTwitterEmail] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refreshSession = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/twitter/session`, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch session');
      }
      
      const data = await res.json();
      setTwitterHandle(data.twitter_handle || null);
      setTwitterName(data.twitter_name || null);
      setTwitterAvatar(data.twitter_avatar || null);
      setTwitterEmail(data.twitter_email || null);
      setError(null);
    } catch (err) {
      console.error('Error fetching Twitter session:', err);
      setError(err as Error);
      // Clear session data on error
      setTwitterHandle(null);
      setTwitterName(null);
      setTwitterAvatar(null);
      setTwitterEmail(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return { twitterHandle, twitterName, twitterAvatar, twitterEmail, error, refreshSession, isLoading };
}
