import React from "react";
import Loader from "./Loader";

interface ButtonProps {
  text: string;
  isLoading: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, isLoading }) => {
  return (
    <button
      className="py-4 mt-7 max-w-full text-white bg-blue-500 rounded-md w-[725px] max-md:px-5 max-md:mt-10"
      type="submit"
    >
      {isLoading ? <Loader /> : `${text}`}
    </button>
  );
};

export default Button;
