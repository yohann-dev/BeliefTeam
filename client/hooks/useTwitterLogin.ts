import router from "next/router";
import { useState } from "react";
import axios from "axios";

export const useTwitterLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const login = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/twitter/login`, {
        withCredentials: true
      });
      window.location.href = data.url;
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
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/twitter/logout`, {
        withCredentials: true
      });
      
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