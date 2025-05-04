import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { env } from './env';

export const twitterConfig = {
    consumerKey: env.TWITTER_API_KEY,
    consumerSecret: env.TWITTER_API_SECRET_KEY,
    callbackUrl: env.TWITTER_CALLBACK_URL,
};

export const oauth = new OAuth({
    consumer: { key: twitterConfig.consumerKey, secret: twitterConfig.consumerSecret },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
        return crypto.createHmac("sha1", key).update(base_string).digest("base64");
    },
}); 