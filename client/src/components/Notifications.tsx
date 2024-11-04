import React, { useContext, useState } from "react";
import { Notification } from "../types/Notification";
import { UserContext } from "../UserContext";
import { socket } from "../socket";

interface NotificationsProps {
  notifications: Notification[];
  username: string;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  username,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notification = useContext(UserContext);

  if (!notification) {
    throw new Error("AppRoutes must be used within a UserContextProvider");
  }
  const { setNotifications } = notification;
  const handleStatus = async (
    notificationId: string,
    status: "pending" | "accepted" | "rejected"
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/notifications/update-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: notificationId, status }),
        }
      );
      if (!response.ok) {
        throw Error("Failed to updated status");
      }
      // Update the local state after the status change
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, status }
            : notification
        )
      );
      const data = await response.json();
      console.log(data);
      //Emit the response so that the sender also knows whether the user has accepted or rejected thier collabRequest
      socket.emit("sendResponse", data.notification, username, data.document);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div className="flex">
            <li
              key={index}
              className="pl-5 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {notification.message}
            </li>
            <div className="btns flex items-center px-2">
              {notification.status === "pending" &&
              notification.type === "request" ? (
                <>
                  <button
                    className=" mx-1 w-10 flex items-center justify-center rounded text-[18px] bg-green-300  hover:bg-green-400"
                    onClick={() => handleStatus(notification._id, "accepted")}
                  >
                    ✓
                  </button>
                  <button
                    className=" mx-1 w-10 flex items-center justify-center rounded text-[18px] bg-red-300 hover:bg-red-400"
                    onClick={() => handleStatus(notification._id, "rejected")}
                  >
                    x
                  </button>
                </>
              ) : notification.status === "accepted" ? (
                <div className="text-green-500">Accepted</div>
              ) : notification.status === "rejected" ? (
                <div className="text-red-500">Rejected</div>
              ) : isLoading ? (
                <div>Loading</div>
              ) : null}
            </div>
          </div>
        ))
      ) : (
        <li className="px-4 py-2 text-sm text-gray-500">
          No new notifications
        </li>
      )}
    </>
  );
};

export default Notifications;
