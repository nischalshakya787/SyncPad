import { toast, ToastContainer } from "react-toastify";
import { CreateSection, RecentDocumentsSection } from "../components";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { IoIosNotifications } from "react-icons/io";

const Home = () => {
  const location = useLocation();
  const [showMessage, setShowMessage] = useState<boolean>(false);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
  }, [location.state]);

  const context = useContext(UserContext);
  if (!context) {
    throw new Error("Header must be used within a UserContextProvider");
  }
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  const { user, setUser } = context;
  const username = user?.username;
  return (
    <main className="flex overflow-hidden flex-col bg-gray-100">
      <ToastContainer />
      <header className="flex flex-wrap gap-5 justify-between px-8 py-3.5 w-full bg-gray-100 shadow-sm max-md:px-5 max-md:max-w-full">
        <div className="px-2 text-xs text-black whitespace-nowrap rounded-full bg-zinc-300 h-[50px] w-[50px] flex items-center justify-center">
          LOGO
        </div>
        {username ? (
          <div className="flex items-center">
            <div className="relative message text-[30px] mx-6 cursor-pointer rounded-full p-1 hover:bg-gray-200">
              <IoIosNotifications />

              {/* Notification count badge */}
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                5
              </span>
            </div>
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
