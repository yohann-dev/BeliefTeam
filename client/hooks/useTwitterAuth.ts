export const useTwitterLogin = () => {
    const login = async () => {
      const res = await fetch("http://localhost:3000/api/twitter/login");
      const { url } = await res.json();
      window.location.href = url;
    };
    return { login };
};