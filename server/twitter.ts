import { TwitterApi } from 'twitter-api-v2';

export interface ReplyInfo {
  url: string;
  createdAt: string;
}

export async function fetchBelieveReplies(): Promise<ReplyInfo[]> {
  // Initialize Twitter client
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  });

  // First, get the user ID for launchacoin
  const user = await client.v2.userByUsername('launchacoin');
  
  // Search for replies to launchacoin
  const searchResults = await client.v2.search({
    query: `to:${user.data.id}`,
    'tweet.fields': ['created_at', 'entities', 'text'],
    max_results: 100,
  });

  const replies: ReplyInfo[] = [];
  
  for await (const tweet of searchResults) {
    console.log('Tweet text:', tweet.text);
    console.log('Tweet entities:', JSON.stringify(tweet.entities, null, 2));
    if (tweet.entities?.urls) {
      tweet.entities.urls.forEach(url => {
        replies.push({
          url: url.expanded_url,
          createdAt: tweet.created_at!,
        });
      });
    }
  }

  return replies;
}
