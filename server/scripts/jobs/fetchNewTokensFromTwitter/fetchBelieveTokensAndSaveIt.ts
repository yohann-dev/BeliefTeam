import 'dotenv/config';
import { Scraper, SearchMode } from "agent-twitter-client";
import { db } from '../../../firebase';

const getTweetRepliesFromlaunchcoins = async () => {
    const scraper = new Scraper();
    const tokensData: any[] = [];
    
    await scraper.login(
        process.env.X_LOGIN!,
        process.env.X_PASSWORD!,
        process.env.X_EMAIL_OR_PHONE,
        process.env.TWITTER_OAUTH2,
        process.env.TWITTER_API_KEY,
        process.env.TWITTER_API_SECRET_KEY,
        process.env.TWITTER_ACCESS_TOKEN,
        process.env.TWITTER_ACCESS_TOKEN_SECRET
    );

    let isLast = false;
    let nextCursor;
    const [lastTimestampSaved, lastTweetIdSaved] = await getLastTimestampAndLastTweetIdSaved();
    let newestLastTimestamp = lastTimestampSaved;
    let lastTweetIdToSave = lastTweetIdSaved;

    
    while (!isLast) {
        console.log(`Fetching tweets from ${nextCursor}`);
        let response;
        try {
            response = await fetchTweetsFromTwitter(scraper, nextCursor);

        } catch (error) {
            console.error(`Error fetching tweets from ${nextCursor}:`, error);
            await waitForXSeconds(60);
            continue;
        }
        nextCursor = response.next;
        if (!nextCursor) {
            isLast = true;
        }

        if (response.tweets.length === 0) {
            isLast = true;
            continue;
        }

        for (const tweet of response.tweets) {
            if (tweet.id === lastTweetIdSaved) {
                isLast = true;
                break;
            }

            const createdAt = tweet.timestamp;
            if (createdAt && createdAt > newestLastTimestamp) {
                newestLastTimestamp = createdAt;
                lastTweetIdToSave = tweet.id || '';
            }

            const tokenData = getTokenData(tweet);
            if (!tokenData.tokenAddress || tweet?.text?.includes('Failed to launch your coin.')) continue;

            console.log(`Fetched: Token from @${tokenData.author} - with address:${tokenData.tokenAddress}`);
            tokensData.push(tokenData);
        }

        await waitForXSeconds(10);
    }

    await saveLastTimestampAndLastTweetId(newestLastTimestamp, lastTweetIdToSave);

    return tokensData;
};

const getLastTimestampAndLastTweetIdSaved = async (): Promise<[number, string]> => {
    const metaRef = db.collection("meta").doc("scraper");
    const metaSnap = await metaRef.get();
    const lastTimestamp = metaSnap.exists ? metaSnap.data()?.lastTweetTimestamp : 0;
    const lastTweetId = metaSnap.exists ? metaSnap.data()?.lastSavedTweetId : '';

    return [lastTimestamp, lastTweetId];
};

const saveLastTimestampAndLastTweetId = async (lastTimestamp: number, lastTweetId: string) => {
    const metaRef = db.collection("meta").doc("scraper");
    await metaRef.set({ lastTweetTimestamp: lastTimestamp, lastSavedTweetId: lastTweetId }, { merge: true });
};

const waitForXSeconds = (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

const fetchTweetsFromTwitter = async (scraper: Scraper, cursor?: string) => {
    const tweetsReplies = await scraper.fetchSearchTweets('from:launchcoin', 50, SearchMode.Latest, cursor);

    return tweetsReplies;
};

const getTokenData = (tweetReply: any) => {
    const tokenAddress = tweetReply.urls[0]?.split('/')?.pop();
    
    // Extract author (remove @)
    const author = tweetReply.text.match(/@(\w+)/)?.[1] || '';
    
    // Extract coin name (text between single quotes)
    const coinName = tweetReply.text.match(/'([^']+)'/)?.[1] || '';
    
    // Extract token symbol (text between parentheses)
    const tokenSymbol = tweetReply.text.match(/\(([^)]+)\)/)?.[1] || '';

    const createdAt = tweetReply.timestamp;
    
    return {
        author,
        coinName,
        tokenSymbol,
        tokenAddress,
        createdAt
    };
};

const saveTokensInBatchToFirebase = async (tokensData: any) => {
    console.log(`Saving ${tokensData.length} tokens in the database.`);
    try {
        const tokensRef = db.collection('tokens');

    const batchSize = 400;
    for (let i = 0; i < tokensData.length; i += batchSize) {
        const batch = db.batch();

        for (const tokenData of tokensData.slice(i, i + batchSize)) {
            console.log(`Saving token ${tokenData.tokenAddress} in the database.`);
            const ref = tokensRef.doc(tokenData.tokenAddress);
            batch.set(ref, tokenData, { merge: true });
        }

            await batch.commit();
        }
    } catch (error) {
        console.error(`Error saving tokens in the database:`, error);
    }
};

const fetchBelieveTokensAndSaveIt = async () => {
    const tokensDataFromlaunchcoins = await getTweetRepliesFromlaunchcoins();

    await saveTokensInBatchToFirebase(tokensDataFromlaunchcoins);

    console.log('All tokens saved in the database.');
    process.exit(0);
};

fetchBelieveTokensAndSaveIt();