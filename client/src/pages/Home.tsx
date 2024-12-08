import { toast, ToastContainer } from "react-toastify";
import {
  CreateSection,
  Notifications,
  RecentDocumentsSection,
} from "../components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo.svg";

const Home = () => {
  const location = useLocation();
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const content = useContext(UserContext);

  if (!content) {
    throw new Error("AppRoutes must be used within a UserContextProvider");
  }

  const { notifications } = content;

  useEffect(() => {
    if (location.state?.toastMessage && location.state?.from === "login") {
      toast.success(location.state.toastMessage);
    }
    navigate(location.pathname, { replace: true });
  }, [location.state]);

  const context = useContext(UserContext);
  if (!context) {
    throw new Error("Header must be used within a UserContextProvider");
  }
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  const { user, setUser } = context;
  const username = user?.username;

  return (
    <main className="flex overflow-hidden flex-col bg-[#f9fbfd]">
      <ToastContainer />
      <header className="flex flex-wrap gap-5 justify-between px-8 py-3.5 w-full bg-[#f9fbfd] shadow-sm max-md:px-5 max-md:max-w-full border-b-2">
        <div className="flex  items-center rounded-full h-[45px] w-[45px] mx-5 cursor-pointer">
          <img
            loading="lazy"
            src={logo}
            alt="logo"
            className="object-contain aspect-square"
          />
          <span
            style={{ fontWeight: "500" }}
            className="mx-4 text-[20px] text-center text-bold text-ellipsis text-gray-800"
          >
            SyncPad
          </span>
        </div>

        {username ? (
          <div className="relative flex items-center">
            <div
              className="relative message text-[30px] mx-2 cursor-pointer rounded-full p-1 hover:bg-gray-200"
              onClick={() => setShowNotification(!showNotification)}
            >
              <IoIosNotifications />

              {/* Notification count badge */}
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            </div>

            {/* Notification dropdown menu */}
            {showNotification && (
              <div className="absolute right-0 top-[55px] w-[400px] bg-white border border-gray-200 rounded-lg shadow-lg transform translate-y-0">
                <div className="p-4 text-lg font-bold border-b">
                  Notifications
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  <Notifications
                    notifications={notifications}
                    username={username}
                  />
                </ul>
              </div>
            )}

            <Link to="/profile">
              <div className="profile mx-4">
                <FaUser size={25} />
              </div>
            </Link>
            <button
              className="px-6 py-4 text-base font-bold text-white bg-red-500 rounded-lg max-md:px-5"
              onClick={handleLogOut}
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            className="px-6 py-4 text-base font-bold text-white bg-blue-500 rounded-lg max-md:px-5"
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign in
          </button>
        )}
      </header>
      <CreateSection />
      <RecentDocumentsSection user={user} />
    </main>
  );
};

export default Home;
