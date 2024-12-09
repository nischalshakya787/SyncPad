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
import profile from "../assets/image/profile.jpg";

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
      <header className=" fixed top-0 left-0 z-50 flex items-center justify-between px-8 py-4 w-full bg-[#f9fbfd] shadow-sm border-b max-md:px-5">
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="h-[45px] w-[45px]">
            <img
              loading="lazy"
              src={logo}
              alt="logo"
              className="object-contain aspect-square rounded-full"
            />
          </div>
          <span
            className="text-[18px] text-gray-700"
            style={{ fontWeight: 600 }}
          >
            SyncPad
          </span>
        </div>

        {/* User Interaction Section */}
        {username ? (
          <div className="relative flex items-center gap-4">
            {/* Notifications Icon */}
            <div
              className="relative text-[26px] cursor-pointer rounded-full p-2 hover:bg-gray-200 transition"
              onClick={() => setShowNotification(!showNotification)}
            >
              <IoIosNotifications />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>

            {/* Notification Dropdown */}
            {showNotification && (
              <div className="absolute right-0 top-[55px] w-[350px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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

            {/* Profile Link */}
            {/* <div className="h-[45px] w-[45px] cursor-pointer"> */}
            <Link to="/profile" className="flex items-center">
              <div key={user.username} className="relative group">
                <img
                  src={`${
                    user.persona?.length === 0
                      ? profile
                      : `https://api.dicebear.com/9.x/bottts/svg?seed=${user.persona}&backgroundColor=ffdfbf`
                  }`}
                  alt={user.username}
                  className="w-11 h-11 rounded-full border-2 border-white cursor-pointer transition-transform duration-200 hover:scale-105"
                />
                <div className="absolute mb-1 w-max px-2 py-1 text-sm text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {user.username}
                </div>
              </div>
              {/* </div> */}
            </Link>

            {/* Log Out Button */}
            <button
              style={{ backgroundColor: "#ff5555" }}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg hover:bg-red-600 transition max-md:px-3 max-md:py-1"
              onClick={handleLogOut}
            >
              Log out
            </button>
          </div>
        ) : (
          /* Sign In Button */
          <button
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition max-md:px-3 max-md:py-1"
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign In
          </button>
        )}
      </header>

      <CreateSection />
      <RecentDocumentsSection user={user} />
    </main>
  );
};

export default Home;
