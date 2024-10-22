import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "../constants";
import { socket } from "../socket";

const Document = () => {
  const [value, setValue] = useState("");

  useEffect(() => {
    socket.emit("document", value);
    socket.on("document", (value) => {
      setValue(value);
    });
  }, [value]);

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
          onChange={setValue}
          modules={modules}
          formats={formats}
          style={{ width: "900px" }}
        />
      </div>
    </div>
  );
};

export default Document;
