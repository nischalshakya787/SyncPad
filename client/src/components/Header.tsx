import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="flex flex-wrap gap-5 justify-between px-8 py-3.5 w-full bg-gray-100 shadow-sm max-md:px-5 max-md:max-w-full">
      <div className="px-2 text-xs text-black whitespace-nowrap rounded-full bg-zinc-300 h-[50px] w-[50px] flex items-center justify-center">
        LOGO
      </div>
      <button
        className="px-6 py-4 text-base font-bold text-white bg-blue-500 rounded-lg max-md:px-5"
        onClick={() => {
          navigate("/login");
        }}
      >
        Sign in
      </button>
    </header>
  );
};

export default Header;
