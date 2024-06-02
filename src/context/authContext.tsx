import { ReactNode, createContext, useState } from "react";

type User = {
  userName: string,
  email: string,
}
type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({children}: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  return <AuthContext.Provider value={{user, setUser}}>{children}</AuthContext.Provider>;
}
