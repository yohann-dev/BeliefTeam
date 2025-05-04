import { useTwitterLogin, useTwitterLogout } from "../hooks/useTwitterLogin";
import { useTwitterSession } from "../hooks/useTwitterSession";
import { useState } from "react";

export default function TwitterLoginButton() {
    const { login, isLoading: isLoginLoading } = useTwitterLogin();
    const { twitterHandle, twitterAvatar, isLoading: isSessionLoading } = useTwitterSession();
    const { logout, isLoading: isLogoutLoading } = useTwitterLogout();
    const [isLoggingIn] = useState(false);
    const [isLoggingOut] = useState(false);

    if (isSessionLoading || isLoginLoading || isLogoutLoading) {
        return (

            <div className="absolute top-6 right-6 z-50">
                <svg className="animate-spin h-6 w-6 text-meme-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="absolute top-6 right-6 z-50">
            {twitterHandle ? (
                <div className="flex items-center space-x-3 bg-white p-2 rounded-xl shadow border border-gray-200">
                    <img src={twitterAvatar || ""} alt="Profile" className="h-8 w-8 rounded-full" />
                    <span className="text-gray-800 font-medium">
                        @{twitterHandle}
                    </span>
                    <button
                        onClick={logout}
                        disabled={isLoggingOut}
                        className="ml-4 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoggingOut ? (
                            <div className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Disconnecting...
                            </div>
                        ) : (
                            "Disconnect"
                        )}
                    </button>
                </div>
            ) : (
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={login}
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <div className="flex items-center">
                            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            Connecting...
                        </div>
                    ) : (
                        "Login with Twitter"
                    )}
                </button>
            )}
        </div>
    );
}