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
    sender: string;
    reciever: string;
    docId: string;
  }
  useEffect(() => {
    const saveNotification = async ({
      message,
      sender,
      reciever,
      docId,
    }: saveNotificationProps) => {
      try {
        await fetch("http://localhost:3000/notifications/save-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender, reciever, message, docId }),
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      socket.emit("joinRoom", userId);
      socket.on(
        "collabNotification",
        (message: string, sender: string, reciever: string, docId: string) => {
          setNotification((prevNotification) => [...prevNotification, message]);
          saveNotification({ message, sender, reciever, docId });
        }
      );

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
