import React from "react";

interface ButtonProps {
  text: string;
}

const Button: React.FC<ButtonProps> = ({ text }) => {
  return (
    <button className="py-4 mt-7 max-w-full text-white bg-blue-500 rounded-md w-[725px] max-md:px-5 max-md:mt-10">
      {text}
    </button>
  );
};

export default Button;
