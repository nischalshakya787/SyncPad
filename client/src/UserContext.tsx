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
import { Document } from "./types/Document";

interface UserContextType {
  user: UserProps | null;
  setUser: Dispatch<SetStateAction<UserProps | null>>;
  userId: string | null;
  setUserId: Dispatch<SetStateAction<string | null>>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  documents: Document[];
  setDocuments: Dispatch<SetStateAction<Document[]>>;
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
  const [documents, setDocuments] = useState<Document[]>([]);

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
    if (user) {
      fetchUserData();
    }
  }, [user, setUser]);

  interface saveNotificationProps {
    message: string;
    senderId: string;
    recieverId: string;
    docId: string;
    type: string;
  }

  //Function to save a newly delivered notification
  const saveNotification = async ({
    message,
    senderId,
    recieverId,
    docId,
    type,
  }: saveNotificationProps) => {
    try {
      const response = await fetch(
        "http://localhost:3000/notifications/save-notification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId, recieverId, message, docId, type }),
        }
      );

      if (response.ok) {
        //This will return saved document and updates the state for notification for real time
        const savedNotification = await response.json();
        setNotifications((prev) => [...prev, savedNotification.notification]);
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
        ({ type, message, senderId, recieverId, docId }) => {
          saveNotification({ message, senderId, recieverId, docId, type });
        }
      );

      // Cleanup socket listener on component unmount
      return () => {
        socket.off("collabNotification"); // Cleanup listener on unmount
      };
    }
  }, [userId, socket]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (user) {
        //Only fetches if user is logged in
        try {
          const response = await fetch(
            `http://localhost:3000/docs/document/fetch?id=${user?.id}`,
            {
              method: "GET",
            }
          );

          const data = await response.json();
          setDocuments(data.document || []); // Ensure data is an array
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      } else {
        setDocuments([]); //If not logged in
      }
    };

    fetchDocuments();
  }, [user]); // Only run this effect when `user` changes

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userId,
        setUserId,
        notifications,
        setNotifications,
        documents,
        setDocuments,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
