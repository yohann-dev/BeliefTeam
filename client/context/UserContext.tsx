import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = any;

const UserContext = createContext<{ user: User, setUser: (u: User) => void }>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const fetchTwitter = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();
      setUser(data.twitter_user);
    };
    fetchTwitter();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 