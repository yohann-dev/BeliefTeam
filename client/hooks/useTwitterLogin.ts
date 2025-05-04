import router from "next/router";
import { useState } from "react";


export const useTwitterLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
    const login = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/twitter/login`);
        const { url } = await res.json();
        window.location.href = url;
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      }
    };
    return { login, isLoading };
};

export const useTwitterLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
    const logout = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/twitter/logout`, {
                method: 'GET',
                credentials: 'include',
            });
            
            if (!res.ok) {
                throw new Error('Failed to logout');
            }
            
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });

            router.push('/');
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    return { logout, isLoading };
};