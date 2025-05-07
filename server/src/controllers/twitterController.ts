import { Request, Response } from 'express';
import axios from 'axios';
import { oauth, twitterConfig } from '../config/twitter';
import { env } from '../config/env';

export const twitterController = {
    async login(req: Request, res: Response) {
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
    },

    async callback(req: Request, res: Response) {
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

            // Set cookies with proper settings
            const cookieOptions = {
                httpOnly: env.NODE_ENV === 'production',
                secure: env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
                path: '/',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days,
                domain: new URL(env.FRONTEND_ORIGIN).hostname
            };

            console.log('New cookies:', {
                twitter_handle: screen_name,
                twitter_name: name,
                twitter_email: email
            });

            res.cookie("twitter_handle", screen_name, cookieOptions);
            res.cookie("twitter_name", name, cookieOptions);
            res.cookie("twitter_avatar", profile_image_url_https, cookieOptions);
            if (email) {
                res.cookie("twitter_email", email, cookieOptions);
            }

            // Redirect with a success message
            res.redirect(`${env.FRONTEND_ORIGIN}/projects/new?login=success`);
        } catch (error: any) {
            console.error('Error handling Twitter callback:', error.message);
            res.redirect(`${env.FRONTEND_ORIGIN}/?error=login_failed`);
        }
    },

    async getSession(req: Request, res: Response) {
        try {
            const twitter_handle = req.cookies?.twitter_handle;
            const twitter_name = req.cookies?.twitter_name;
            const twitter_avatar = req.cookies?.twitter_avatar;
            const twitter_email = req.cookies?.twitter_email;

            if (!twitter_handle && !twitter_name && !twitter_avatar && !twitter_email) {
                return res.json({ 
                    twitter_handle: null, 
                    twitter_name: null, 
                    twitter_avatar: null, 
                    twitter_email: null 
                });
            }

            res.json({ 
                twitter_handle, 
                twitter_name, 
                twitter_avatar, 
                twitter_email 
            });
        } catch (error: any) {
            console.error('Error getting session:', error.message);
            res.status(500).json({ 
                error: 'Failed to get session',
                details: error.message 
            });
        }
    },

    async logout(req: Request, res: Response) {
        try {
            res.clearCookie('twitter_handle', { path: '/' });
            res.clearCookie('twitter_name', { path: '/' });
            res.clearCookie('twitter_avatar', { path: '/' });
            res.clearCookie('twitter_email', { path: '/' });
            res.json({ message: 'Logged out' });
        } catch (error: any) {
            console.error('Error during logout:', error.message);
            res.status(500).json({ error: 'Failed to logout' });
        }
    }
}; 