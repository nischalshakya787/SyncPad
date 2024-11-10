import React, { useEffect, useRef, useState } from "react";
import { MdOutlineMessage, MdClose } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import profile from "../assets/image/profile.jpg";
import { socket } from "../socket";
import { UserListProps } from "../types/User";
import { Chat, ChatBoxProps } from "../types/Chat";

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null); //This ref is used to auto scroll the window if new chats are added
  const [inputValue, setInputValue] = useState<string>("");
  const [isMentionBox, setIsMentionBox] = useState<boolean>(false); //To open and close mention box
  const [mention, setMention] = useState<{
    id: string;
    sender: string | undefined;
    senderId: string | undefined;
    docId: string | undefined;
  } | null>(null);

  //Initially this state will contain object of all the collabs and owners, later this state will be filtered according to the mentions
  const [filteredUsers, setFilteredUsers] = useState<UserListProps[]>(userList);
  const maxHeight = 150;

  //To fetch chat in intial load
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

  //To achieve auto scroll behaviour when new chats appear
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
    const value = event.target.value;
    setInputValue(value);

    // Check if @ is present in the input
    if (!value.includes("@")) {
      setIsMentionBox(false);
      setMention(null);
      setFilteredUsers([]); // No filtering when @ is absent
    }

    // If @ is at the end of the text, show the mention box
    if (value[value.length - 1] === "@") {
      setIsMentionBox(true);
    }

    // Match text after the @ symbol
    const mentionMatch = value.match(/@(\S*)$/);

    if (mentionMatch && mentionMatch[1]) {
      const searchTerm = mentionMatch[1].toLowerCase();

      // If there's text after @, filter users based on the search term
      const filtered = userList.filter((user) =>
        user.username.toLowerCase().includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else if (mentionMatch && mentionMatch[1] === "") {
      // If @ is followed by nothing, show all users
      setFilteredUsers(userList);
    } else {
      setFilteredUsers([]);
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
        //Updating the states if new message is recieved
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
    //To send mention notification to the user
    if (mention) {
      socket.emit("sendMentionNotification", mention);
    }
    //Sending message to the group chat
    socket.emit("send-message", {
      docId,
      senderId: userId,
      message: inputValue,
      username,
      persona,
      timestamp: new Date().toISOString(),
    });
  };

  //To handle the mention selection
  const handleUserSelection = (
    user: UserListProps,
    username: string | undefined
  ) => {
    setInputValue(
      inputValue.replace(
        /@(\S*)/g, //Regex to replace username after clicking the selection
        `@${user.username}`
      )
    );
    setMention({
      id: user._id,
      sender: username,
      senderId: userId,
      docId: docId,
    });
    setIsMentionBox(false);
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
                {isMentionBox && (
                  <div className="absolute bottom-16 left-24 transform -translate-x-1/2 w-[200px] max-h-[200px] overflow-y-auto p-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <div className="space-y-1">
                      {filteredUsers.map((user) => (
                        <button
                          key={user._id} // Add a key to improve rendering performance
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 focus:outline-none"
                          onClick={() => {
                            handleUserSelection(user, username);
                          }}
                          aria-label={`Mention ${user.username}`}
                        >
                          {user.username}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
          {/* Profile persona */}
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
