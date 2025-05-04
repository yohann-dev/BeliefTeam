import { useEffect, useState } from "react";
import axios from "axios";

export function useTwitterSession() {
  const [isLoading, setIsLoading] = useState(true);
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [twitterName, setTwitterName] = useState<string | null>(null);
  const [twitterAvatar, setTwitterAvatar] = useState<string | null>(null);
  const [twitterEmail, setTwitterEmail] = useState<string | null>(null);

  const refreshSession = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/twitter/session`, {
        withCredentials: true,
        headers: {
          "Accept": "application/json"
        }
      });
      
      setTwitterHandle(data.twitter_handle || null);
      setTwitterName(data.twitter_name || null);
      setTwitterAvatar(data.twitter_avatar || null);
      setTwitterEmail(data.twitter_email || null);
    } catch (err) {
      console.error('Error fetching Twitter session:', err);
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

  return { twitterHandle, twitterName, twitterAvatar, twitterEmail, refreshSession, isLoading };
}
