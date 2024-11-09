import React, { useEffect, useRef, useState } from "react";
import { MdOutlineMessage, MdClose } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import profile from "../assets/image/profile.jpg";
import { socket } from "../socket";

type UserListProps = {
  _id: string;
  username: string;
  persona: string;
};
type ChatBoxProps = {
  isChatBox: boolean;
  setIsChatBox: React.Dispatch<React.SetStateAction<boolean>>;
  docId: string | undefined;
  userId: string | undefined;
  persona: string | undefined;

  username: string | undefined;
  userList: [UserListProps];
};
type Chat = Array<{
  senderId: string;
  message: string;
  username: string | undefined;
  persona: string | undefined;
  timestamp: string;
}>;

const ChatBox: React.FC<ChatBoxProps> = ({
  isChatBox,
  setIsChatBox,
  docId,
  userId,
  username,
  persona,
  userList,
}) => {
  const [chat, setChat] = useState<Chat>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isMentionBox, setIsMentionBox] = useState<boolean>(false); //To open and close mention box
  const maxHeight = 150;

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await fetch(`http://localhost:3000/chat/${docId}`);
        if (!response.ok) {
          throw Error("Error fetching Chats");
        }
        const data = await response.json();
        setChat(data.chat);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChat();
  }, []);
  useEffect(() => {
    if (isChatBox && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isChatBox, messagesEndRef, chat]);

  //To make textarea grow when the length of message increases
  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    const numLines = (element.value.match(/\n/g) || []).length + 1;
    if (numLines > 1) {
      element.style.height = "auto";
    } else {
      element.style.height = "";
    }
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    if (event.target.value[inputValue.length] === "@") {
      setIsMentionBox(true);
    }
    adjustTextareaHeight(event.target);
  };

  //To recieve message
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (chat: {
      senderId: string;
      message: string;
      username: string;
      persona: string;
      timestamp: string;
    }) => {
      setChat((prevChat) => [
        ...prevChat,
        {
          senderId: chat.senderId,
          message: chat.message,
          username: chat.username,
          persona: chat.persona,
          timestamp: chat.timestamp,
        },
      ]);
    };

    socket.on("receive-message", handleMessage);
    // Cleanup listener on component unmount or socket change
    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [socket]);

  //To send the message
  const sendMessage = () => {
    if (!socket || !userId) return;
    setInputValue("");
    setChat((prevChat) => [
      ...prevChat,
      {
        senderId: userId,
        message: inputValue,
        username: username,
        persona: persona,
        timestamp: new Date().toISOString(),
      },
    ]);
    socket.emit("send-message", {
      docId,
      senderId: userId,
      message: inputValue,
      username,
      persona,
      timestamp: new Date().toISOString(),
    });
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
            {chat.map((message, index) => (
              <MessageBox
                key={index}
                message={message.message}
                sender={message.username}
                username={username}
                persona={message.persona}
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
  sender: string | undefined;
  username: string | undefined;
  persona: string | undefined;
};

const MessageBox = ({
  message,
  sender,
  username,
  persona,
}: MessageBoxProps) => {
  return (
    <div className="flex my-5">
      <div className="">
        <div className="role-image rounded-full w-8 h-8 bg-green-600 flex items-center justify-center">
          <img
            src={`${
              persona?.length === 0
                ? profile
                : `https://api.dicebear.com/9.x/bottts/svg?seed=${persona}&backgroundColor=ffdfbf`
            }`}
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
