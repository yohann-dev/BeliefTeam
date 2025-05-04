import express from "express";
import { db } from './firebase';
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import axios from "axios";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser());

const twitterConfig = {
    consumerKey: process.env.TWITTER_CLIENT_ID!,
    consumerSecret: process.env.TWITTER_CLIENT_SECRET!,
    callbackUrl: "http://localhost:3001/api/twitter/callback", // adjust for prod
};

const oauth = new OAuth({
    consumer: { key: twitterConfig.consumerKey, secret: twitterConfig.consumerSecret },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return crypto.createHmac("sha1", key).update(base_string).digest("base64");
    },
});

// Step 1: Get Twitter auth link
router.get("/api/twitter/login", async (req, res) => {
    const request_data = {
      url: "https://api.twitter.com/oauth/request_token",
      method: "POST",
      data: { oauth_callback: twitterConfig.callbackUrl },
    };
  
    const response = await axios.post(request_data.url, null, {
      headers: oauth.toHeader(oauth.authorize(request_data)) as unknown as Record<string, string>,
    });
  
    const result = new URLSearchParams(response.data);
    const oauth_token = result.get("oauth_token");
    res.json({ url: `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}` });
  });
  
  // Step 2: Handle Twitter callback
  router.get("/api/twitter/callback", async (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;
  
    const request_data = {
      url: "https://api.twitter.com/oauth/access_token",
      method: "POST",
      data: { oauth_verifier, oauth_token },
    };
  
    const response = await axios.post(request_data.url, null, {
      headers: oauth.toHeader(oauth.authorize(request_data)) as unknown as Record<string, string>,
    });
  
    const result = new URLSearchParams(response.data as any);
    const screen_name = result.get("screen_name");
    const access_token = result.get("oauth_token");
    const access_token_secret = result.get("oauth_token_secret");
  
    // Set session or cookie
    res.cookie("twitter_user", screen_name, { httpOnly: false });
    res.redirect("/"); // redirect back to your app
});

router.get('/api/get-believe-tokens', async (req, res) => {
    try {
      const tokens = await db.collection('tokens').get();
  
      return res.json(tokens.docs.map(doc => doc.data()));
    } catch (error) {
      console.error('Error fetching believe tokens:', error);
  
      return res.status(500).json({ error: 'Failed to fetch believe tokens' });
    }
});

export default router;