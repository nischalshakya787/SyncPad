import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type userProps = {
  iat: number;
  id: string;
  username: string;
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<userProps | null>(null);
  const [profile, setProfile] = useState(true); // State to control fetching

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userInfo = await response.json();
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (profile) {
      fetchUserData();
      setProfile(false); // Reset after fetching
    }
  }, [profile]); // Depend on profilke

  const handleLogOut = async () => {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setProfile(true);
  };

  const username = user?.username;
  return (
    <header className="flex flex-wrap gap-5 justify-between px-8 py-3.5 w-full bg-gray-100 shadow-sm max-md:px-5 max-md:max-w-full">
      <div className="px-2 text-xs text-black whitespace-nowrap rounded-full bg-zinc-300 h-[50px] w-[50px] flex items-center justify-center">
        LOGO
      </div>
      {username ? (
        <button
          className="px-6 py-4 text-base font-bold text-white bg-red-500 rounded-lg max-md:px-5"
          onClick={handleLogOut}
        >
          Log out
        </button>
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
  );
};

export default Header;
