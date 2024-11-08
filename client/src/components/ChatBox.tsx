import React, { useEffect, useRef, useState } from "react";
import { MdOutlineMessage, MdClose } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import profile from "../assets/image/profile.jpg";

type ChatBoxProps = {
  isChatBox: boolean;
  setIsChatBox: React.Dispatch<React.SetStateAction<boolean>>;
};

const messages = [
  { sender: "Alice", message: "Hey there! How's it going?" },
  { sender: "Bob", message: "Pretty good! Just working on a new project." },
  { sender: "Alice", message: "Nice! What's the project about?" },
  {
    sender: "Bob",
    message: "It's a real-time chat application using React and Socket.IO.",
  },
  {
    sender: "Alice",
    message: "That sounds awesome! Can't wait to try it out.",
  },
  {
    sender: "Bob",
    message: "Thanks! I'll send you the link once it's live.",
  },
  { sender: "Alice", message: "Cool, looking forward to it!" },
  {
    sender: "Bob",
    message: "By the way, let me know if you have any feature ideas.",
  },
  { sender: "Alice", message: "Sure, I'll think of something!" },
];

const ChatBox: React.FC<ChatBoxProps> = ({ isChatBox, setIsChatBox }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const maxHeight = 150;
  const sendMessage = () => {};

  useEffect(() => {
    if (isChatBox && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isChatBox, messages]);

  const adjustTextareaHeight = (element) => {
    const numLines = (element.value.match(/\n/g) || []).length + 1;
    if (numLines > 1) {
      element.style.height = "auto";
    } else {
      element.style.height = "";
    }
    element.style.height = `${element.scrollHeight}px`;
  };
  const handleChange = (event) => {
    setInputValue(event.target.value);
    adjustTextareaHeight(event.target);
  };

  return (
    <div className="fixed bottom-5 flex items-end space-x-4">
      {isChatBox && (
        <div className="fixed right-[90px] h-[450px] w-[400px] max-w-full bg-white rounded-lg shadow-lg flex flex-col border border-gray-300">
          {/* Chat Header */}
          <div className="py-2 bg-blue-500 rounded-t-lg text-white text-[18px] text-center">
            Group Chat
          </div>

          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-rounded-md">
            {messages.map((message, index) => (
              <MessageBox
                key={index}
                message={message.message}
                sender={message.sender}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="flex items-center justify-between p-4 bg-gray-100 border-t border-gray-300 rounded-b-lg">
            <div className="w-full flex items-center relative">
              <div className="relative w-full">
                <textarea
                  id="text-box"
                  value={inputValue}
                  onChange={handleChange}
                  className="w-full h-12 resize-none border border-gray-300 pl-6 py-2 pr-14 rounded-md focus:outline-none bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Message Here..."
                  style={{ maxHeight: `${maxHeight}px` }}
                />
                <button
                  onClick={sendMessage}
                  className="absolute right-2 bottom-3 p-2 border border-blue-500 bg-blue-500 text-white cursor-pointer hover:bg-blue-700 rounded-full"
                  disabled={!inputValue}
                >
                  <IoSend />
                </button>
              </div>
            </div>
          </div>
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

type MessageBoxProps = {
  message: string;
  sender: string;
};

const MessageBox = ({ message, sender }: MessageBoxProps) => {
  const username = "Alice";
  return (
    <div className="flex my-5">
      <div className="">
        <div className="role-image rounded-full w-8 h-8 bg-green-600 flex items-center justify-center">
          <img
            src={profile}
            alt=""
            className="w-full h-full rounded-full object-cover"
            style={{ imageRendering: "auto" }}
          />
        </div>
      </div>
      <div className="flex-1 mx-4">
        <div className="role-name font-semibold">
          {sender === username ? "You" : sender}
        </div>
        <div
          className={`response m-0 ${
            sender === username ? "bg-blue-500 text-white" : "bg-[#f0f0f0]"
          } rounded-lg px-2 py-3`}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
