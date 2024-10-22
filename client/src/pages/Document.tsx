import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "../constants";
import { socket } from "../socket";
import { Delta } from "quill";

const Document = () => {
  const [value, setValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    if (!isTyping) {
      socket.on("document", (value) => {
        setValue(value);
      });
    }
  }, [isTyping]);

  const handleChange = (
    content: string,
    delta: Delta,
    source: string,
    editor: any
  ) => {
    console.log("Text without HTML:", editor.getText()); // Text without HTML tags
    setIsTyping(true);
    if (isTyping) {
      socket.emit("document", content);
    } else {
      socket.on("document", (value) => {
        setValue(value);
      });
    }
    setValue(content);
  };

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
          <button className="bg-blue-500 text-white rounded-md p-2">
            Add Collab
          </button>
          <div className="ml-5">Hello, Username</div>
        </div>
      </div>
      <div className="editor h-full flex align-center justify-center py-3">
        <ReactQuill
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
