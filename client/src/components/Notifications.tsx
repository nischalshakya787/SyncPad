import React from "react";
import { Notification } from "../types/Notification";

const handleStatus = async (notificationId: string, status: string) => {
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
  } catch (error) {
    console.log(error);
  }
};
interface NotificationsProps {
  notifications: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
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
              {notification.status === "pending" ? (
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
