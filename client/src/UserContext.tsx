import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { UserProps } from "./types/User";
import { socket } from "./socket";

interface UserContextType {
  user: UserProps | null;
  setUser: Dispatch<SetStateAction<UserProps | null>>;
  userId: string | null;
  setUserId: Dispatch<SetStateAction<string | null>>;
  notification: string[];
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserContextProviderProps {
  children: ReactNode;
}
export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string[]>([]);

  useEffect(() => {
    if (userId) {
      socket.emit("joinRoom", userId);
      socket.on("collabNotification", (message: string) => {
        setNotification((prevNotification) => [...prevNotification, message]);
      });

      return () => {
        socket.off("collabNotification"); // Cleanup listener on unmount
      };
    }
  }, [userId]);

  return (
    <UserContext.Provider
      value={{ user, setUser, userId, setUserId, notification }}
    >
      {children}
    </UserContext.Provider>
  );
}
