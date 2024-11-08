import React from "react";
import { MdOutlineMessage, MdClose } from "react-icons/md";

type ChatBoxProps = {
  isChatBox: boolean;
  setIsChatBox: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatBox: React.FC<ChatBoxProps> = ({ isChatBox, setIsChatBox }) => {
  return (
    <div className="fixed bottom-5 right-5 flex items-end space-x-4">
      {/* Chat Box */}
      {isChatBox && (
        <div className="w-80 h-[400px] p-4 bg-gray-500 shadow-lg rounded-lg mr-[70px]">
          {/* Chat content goes here */}
          <p className="text-gray-700">This is the chat box content!</p>
        </div>
      )}

      {/* Chat Toggle Button */}
      <div
        className={`fixed bottom-5 right-5 p-4 shadow-lg cursor-pointer text-[30px] bg-blue-500 text-white rounded-full transition-transform duration-300 ${
          isChatBox ? "rotate-90 bg-red-500" : ""
        }`}
        onClick={() => setIsChatBox(!isChatBox)}
      >
        {isChatBox ? <MdClose /> : <MdOutlineMessage />}
      </div>
    </div>
  );
};

export default ChatBox;
