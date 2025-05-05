import 'dotenv/config';
import { Scraper, SearchMode } from "agent-twitter-client";
import { db } from '../firebase.ts';

const getTweetRepliesFromlaunchcoins = async () => {
    const scraper = new Scraper();
    const username = 'launchcoin';
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

    const tweetsReplies = await scraper.searchTweets(`from:${username}`, 50, SearchMode.Latest);

    for await (const tweet of tweetsReplies) {
        const tokenData = getTokenData(tweet);
        tokensData.push(tokenData);
    }

    return tokensData;
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

const saveTokensToFirebase = async (tokensData: any) => {
    // Save only if the token is not already in the database
    const tokensRef = db.collection('tokens');
    for (const tokenData of tokensData) {
        const tokenDoc = await tokensRef.where('tokenAddress', '==', tokenData.tokenAddress).get();
        if (tokenDoc.empty) {
            await tokensRef.add(tokenData);
            console.log(`Token with address ${tokenData.tokenAddress} added to the database.`);
        } else {
            console.log(`Token with address ${tokenData.tokenAddress} already exists in the database.`);
        }
    }
};

const fetchBelieveTokensAndSaveIt = async () => {
    const tokensDataFromlaunchcoins = await getTweetRepliesFromlaunchcoins();

    // await saveTokensToFirebase(tokensDataFromlaunchcoins);
};

fetchBelieveTokensAndSaveIt();