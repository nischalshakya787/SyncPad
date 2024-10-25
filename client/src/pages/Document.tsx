import { useContext, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "../constants";
import { socket } from "../socket";
import { Delta } from "quill";
import { UserContext } from "../UserContext";
import { useParams } from "react-router-dom";

const Document = () => {
  const [value, setValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const quillRef = useRef<ReactQuill>(null); // Ref for ReactQuill
  const { id: docId } = useParams<{ id: string }>();

  const context = useContext(UserContext);
  if (!context) {
    throw new Error("Header must be used within a UserContextProvider");
  }

  const { user } = context;

  useEffect(() => {
    if (!isTyping) {
      socket.on("document", (value: string) => {
        setValue(value);
      });
    }
  }, [isTyping, socket]);

  const handleChange = (
    content: string,
    delta: Delta,
    source: string,
    editor: any
  ) => {
    console.log("object");
    if (source === "user") {
      setIsTyping(true);
      socket.emit("document", content);
    }
    setValue(content);
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };
  const handleSave = () => {
    try {
      console.log(docId);
    } catch (error) {
      console.log(error);
    }
  };
  const username = user?.username ? user?.username : "Username";
  return (
    <div className="text-editor border  h-screen">
      <div className="flex border border-gray-300 p-2">
        <div className="w-[75%] flex">
          <div className="flex items-center justify-center">
            <div className="w-[35px] h-[35px] bg-red-600 rounded-[100%]">
              Logo
            </div>
          </div>
          <div className="block ml-3">
            <div className="text-lg px-3">Untitled Document</div>
            <div className="menu flex">
              <div className="buttons px-3 cursor-pointer hover:bg-gray-100">
                File
              </div>
              <div className="buttons px-3 cursor-pointer hover:bg-gray-100">
                Edit
              </div>
              <div className="buttons px-3 cursor-pointer hover:bg-gray-100">
                View
              </div>
              <div className="buttons px-3 cursor-pointer hover:bg-gray-100">
                Insert
              </div>
              <div className="buttons px-3 cursor-pointer hover:bg-gray-100">
                Format
              </div>
              <div className="buttons px-3 cursor-pointer hover:bg-gray-100">
                Tools
              </div>
            </div>
          </div>
        </div>
        <div className="w-[25%] flex items-center ">
          <button
            className="bg-blue-500 text-white rounded-md p-2"
            onClick={handleSave}
          >
            Save
          </button>
          <button className="bg-blue-500 text-white rounded-md p-2">
            Add Collab
          </button>
          <div className="ml-5">Hello, {username}</div>
        </div>
      </div>
      <div className="editor h-full flex align-center justify-center py-3">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          style={{ width: "900px" }}
        />
      </div>
    </div>
  );
};

export default Document;
