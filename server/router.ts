import express from "express";
import { db } from './firebase';
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import axios from "axios";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
router.use(cookieParser());

const twitterConfig = {
    consumerKey: process.env.TWITTER_API_KEY!,
    consumerSecret: process.env.TWITTER_API_SECRET_KEY!,
    callbackUrl: process.env.TWITTER_CALLBACK_URL!,
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
    try {
        if (!twitterConfig.consumerKey || !twitterConfig.consumerSecret) {
            throw new Error('Twitter API credentials are not configured');
        }

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

        if (!oauth_token) {
            throw new Error('Failed to get OAuth token from Twitter');
        }

        res.json({ url: `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}` });
    } catch (error: any) {
        console.error('Error getting Twitter auth link:', error.message);
        res.status(500).json({
            error: 'Failed to get Twitter auth link',
            details: error.message
        });
    }
});

// Step 2: Handle Twitter callback
router.get("/api/twitter/callback", async (req, res) => {
    try {
        const { oauth_token, oauth_verifier } = req.query;

        if (!oauth_token || !oauth_verifier) {
            throw new Error('Missing OAuth token or verifier');
        }

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


        if (!screen_name || !access_token || !access_token_secret) {
            throw new Error('Failed to get Twitter user information');
        }

        const userOauth = {
            key: access_token,
            secret: access_token_secret,
        };

        const verifyRequest = {
            url: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
            method: "GET",
        };

        const userResponse = await axios.get(verifyRequest.url, {
            headers: oauth.toHeader(oauth.authorize(verifyRequest, userOauth)) as unknown as Record<string, string>,
        });

        const { name, profile_image_url_https, email } = userResponse.data;
        res.cookie("twitter_handle", screen_name, { httpOnly: false });
        res.cookie("twitter_name", name, { httpOnly: false });
        res.cookie("twitter_avatar", profile_image_url_https, { httpOnly: false });
        if (email) {
            res.cookie("twitter_email", email, { httpOnly: false });
        }

        res.redirect(`${process.env.FRONTEND_ORIGIN}/projects/new`);
    } catch (error: any) {
        console.error('Error handling Twitter callback:', error.message);
        res.status(500).json({
            error: 'Failed to handle Twitter callback',
            details: error.message
        });
    }
});

router.get("/api/twitter/session", (req, res) => {
    try {
        const twitter_handle = req.cookies.twitter_handle;
        const twitter_name = req.cookies.twitter_name;
        const twitter_avatar = req.cookies.twitter_avatar;
        const twitter_email = req.cookies.twitter_email;
        res.json({ twitter_handle, twitter_name, twitter_avatar, twitter_email });
    } catch (error: any) {
        console.error('Error getting session:', error.response.data);
        res.status(500).json({ error: 'Failed to get session' });
    }
});

router.get('/api/twitter/logout', (req, res) => {
    try {
        // Clear all Twitter-related cookies
        res.clearCookie('twitter_handle', { path: '/' });
        res.clearCookie('twitter_name', { path: '/' });
        res.clearCookie('twitter_avatar', { path: '/' });
        res.clearCookie('twitter_email', { path: '/' });

        // Redirect to the frontend home page
        res.json({ message: 'Logged out' });
    } catch (error: any) {
        console.error('Error during logout:', error.message);
        res.status(500).json({ error: 'Failed to logout' });
    }
});

router.get('/api/getBelieveTokens/', async (req, res) => {
    try {
        const { twitterHandle } = req.query;
        console.log(twitterHandle);
        let tokens;
        if (twitterHandle) {
           //TODO: prevent from injection attack
            tokens = await db.collection('tokens').where('author', '==', twitterHandle).get() || [];
        } else {
            tokens = await db.collection('tokens').get() || [];
        }

        console.log(tokens.docs.map(doc => doc.data()));
        return res.json(tokens.docs.map(doc => doc.data()));
    } catch (error: any) {
        console.error('Error fetching believe tokens:', error.response.data);

        return res.status(500).json({ error: 'Failed to fetch believe tokens' });
    }
});

export default router;