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
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/profile", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          setUser(null);
          setUserId(null);
        }

        const data = await response.json();
        setUser(data.user);
        setUserId(data.user.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [user, setUser]);

  interface saveNotificationProps {
    message: string;
    senderId: string;
    recieverId: string;
    docId: string;
  }
  const saveNotification = async ({
    message,
    senderId,
    recieverId,
    docId,
  }: saveNotificationProps) => {
    try {
      await fetch("http://localhost:3000/notifications/save-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, recieverId, message, docId }),
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (userId) {
      socket.emit("joinRoom", userId);
      socket.on(
        "collabNotification",
        (
          message: string,
          senderId: string,
          recieverId: string,
          docId: string
        ) => {
          setNotification((prevNotification) => [...prevNotification, message]);
          saveNotification({ message, senderId, recieverId, docId });
        }
      );

      return () => {
        socket.off("collabNotification"); // Cleanup listener on unmount
      };
    }
  }, [userId, socket]);

  return (
    <UserContext.Provider
      value={{ user, setUser, userId, setUserId, notification }}
    >
      {children}
    </UserContext.Provider>
  );
}
