import React, { useEffect, useRef, useState } from "react";
import { MdOutlineMessage, MdClose } from "react-icons/md";
import { IoSend } from "react-icons/io5";

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
        <div className="fixed right-[90px] h-[400px] w-80 max-w-full bg-gray-500 rounded-lg shadow-lg flex flex-col">
          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto mt-4 px-4 py-2">
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
          <div className="flex items-center justify-between p-4 bg-lighterDark border-t border-customBorder rounded-b-lg">
            <div className="w-full flex items-center relative">
              <div className="relative w-full">
                <textarea
                  id="text-box"
                  value={inputValue}
                  onChange={handleChange}
                  className="w-full h-12 resize-none border border-customBorder pl-6 py-2 pr-14 rounded-md focus:outline-none bg-lighterDark text-white overflow-hidden"
                  placeholder="Message Gem-Chat..."
                  style={{ maxHeight: `${maxHeight}px` }}
                />
                <button
                  onClick={sendMessage}
                  className="absolute right-4 bottom-2 px-2 py-1 bg-white text-lighterDark rounded-md hover:bg-gray-300 disabled:bg-disabled"
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

const MessageBox = ({ message, sender }) => {
  return (
    <div className="flex my-5">
      <div className="">
        <div className="role-image rounded-full w-8 h-8 bg-green-600 flex items-center justify-center">
          <img
            src={""}
            alt=""
            className="w-full h-full rounded-full object-cover"
            style={{ imageRendering: "auto" }}
          />
        </div>
      </div>
      <div className="flex-1 px-5">
        <div className="role-name font-semibold">
          {sender === "user" ? "You" : "GemChat"}
        </div>
        <div className="response m-0 p-0 w-[80%]">{message}</div>
      </div>
    </div>
  );
};

export default ChatBox;
