import React from "react";

interface ButtonProps {
  text: string;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ text, handleClick }) => {
  return (
    <button
      className="py-4 mt-7 max-w-full text-white bg-blue-500 rounded-md w-[725px] max-md:px-5 max-md:mt-10"
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default Button;
