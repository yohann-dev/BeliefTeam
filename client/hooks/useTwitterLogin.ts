import router from "next/router";
import { useState } from "react";
import axiosInstance from "../lib/axios";

export const useTwitterLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const login = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get('/api/twitter/login');
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
      await axiosInstance.get('/api/twitter/logout');
      
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