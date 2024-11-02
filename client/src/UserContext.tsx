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
import { Notification } from "./types/Notification";

interface UserContextType {
  user: UserProps | null;
  setUser: Dispatch<SetStateAction<UserProps | null>>;
  userId: string | null;
  setUserId: Dispatch<SetStateAction<string | null>>;
  notifications: Notification[];
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  //Fetches the notification when user loggs in
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/notifications/fetch?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        //Will return an array of notifications which a user has recieved
        const data = await response.json();
        setNotifications(data.notification);
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };
    //Ensure the function is only called when user is logged in
    if (userId) {
      fetchNotification();
    }
  }, [userId]);

  //Fetches user data when the context is first used
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/profile", {
          method: "GET",
          credentials: "include", //Includes cookiee
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
    //Fetches only when user is not logged in
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

  //Function to save a newly delivered notification
  const saveNotification = async ({
    message,
    senderId,
    recieverId,
    docId,
  }: saveNotificationProps) => {
    try {
      const response = await fetch(
        "http://localhost:3000/notifications/save-notification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId, recieverId, message, docId }),
        }
      );

      if (response.ok) {
        //This will return saved document and updates the state for notification for real time
        const savedNotification = await response.json();
        setNotifications((prev) => [...prev, savedNotification]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //To handle socket connection and listens for nrew collaboration notifications
  useEffect(() => {
    if (userId) {
      socket.emit("joinRoom", userId); //Join the user's socket rooom

      //When recieving response from backend "collabNotification" it immediately invokes the saveNotifaction
      socket.on(
        "collabNotification",
        (
          message: string,
          senderId: string,
          recieverId: string,
          docId: string
        ) => {
          saveNotification({ message, senderId, recieverId, docId });
        }
      );

      // Cleanup socket listener on component unmount
      return () => {
        socket.off("collabNotification"); // Cleanup listener on unmount
      };
    }
  }, [userId, socket]);

  return (
    <UserContext.Provider
      value={{ user, setUser, userId, setUserId, notifications }}
    >
      {children}
    </UserContext.Provider>
  );
}
