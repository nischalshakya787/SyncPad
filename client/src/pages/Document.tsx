import React, { useContext, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "../constants";
import { socket } from "../socket";
import { Delta } from "quill";
import { UserContext } from "../UserContext";
import { useParams } from "react-router-dom";

const Document = () => {
  const [value, setValue] = useState<string>("");
  const [docTitle, setDocTitle] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false); //to track if the user is typing or not
  const quillRef = useRef<ReactQuill>(null); // Ref for ReactQuill
  const { id: docId } = useParams<{ id: string }>(); //to fetch the id from /document/:id
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const context = useContext(UserContext); //to get the logged in user
  if (!context) {
    throw new Error("Header must be used within a UserContextProvider");
  }

  const { user } = context;

  useEffect(() => {
    if (!isTyping) {
      socket.on("document", (value: string) => {
        //this is for the user who is not typing
        setValue(value);
      });
    }
  }, [isTyping, socket]);

  //To reload the saved value of a document
  useEffect(() => {
    const fetchDocument = async () => {
      const response = await fetch(
        `http://localhost:3000/document?id=${docId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setDocTitle(data.title);
      setValue(data.value);
    };
    fetchDocument();
  }, []);

  //When we type in the canvas this function will execute and emits the updated value to the server and server will emit the changes to the collabs
  const handleChange = (
    content: string,
    delta: Delta,
    source: string,
    editor: any
  ) => {
    if (source === "user") {
      setIsTyping(true);
      socket.emit("document", content); //emitting the typed content to the server
    }
    setValue(content);
    //to make isTyping false after 1sec
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  //To save the document
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/document/${docId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  //For updating the name of the docs. When we are updating the name of the docs and when user clicks away from the div this will execute
  const handleBlur = async () => {
    if (divRef.current) {
      const updatedTitle = divRef.current.textContent || "";
      setDocTitle(updatedTitle); // Update state with the latest title

      // Make an API call with the latest title
      try {
        const response = await fetch(
          "http://localhost:3000/document/update-name",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: docId, title: updatedTitle }), // Use the updated title
          }
        );

        // Check if the response is ok
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error updating document title:", error);
      }
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
            <div
              className="text-lg px-3"
              contentEditable
              suppressContentEditableWarning
              ref={divRef}
              onBlur={handleBlur}
              onInput={() => null} // Prevents React from interfering with cursor position
            >
              {docTitle}
            </div>
            <div className="menu flex">
              <MenuComponent name="File" />
              <MenuComponent name="Edit" />
              <MenuComponent name="View" />
              <MenuComponent name="Insert" />
              <MenuComponent name="Format" />
              <MenuComponent name="Tools" />
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
          <button
            className="bg-blue-500 text-white rounded-md p-2"
            onClick={() => setIsModalOpen(true)}
          >
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
      {isModalOpen && <AddCollabModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

const MenuComponent: React.FC<{ name: String }> = ({ name }) => {
  return (
    <div className="buttons px-3 cursor-pointer hover:bg-gray-100">{name}</div>
  );
};

type AddCollabModal = {
  setIsModalOpen: (value: boolean) => void;
};

const AddCollabModal = ({ setIsModalOpen }: AddCollabModal) => {
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState(null);
  const [box, setBox] = useState<boolean>(false);
  const searchUser = async () => {
    setBox(true);
    try {
      const response = await fetch(`http://localhost:3000/user?email=${email}`);
      if (!response.ok) {
        throw Error("Server error");
      }
      const data = await response.json();

      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setBox(false);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Add Collab</p>
          <button
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <label htmlFor=""> User Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Enter the User's Email"
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          {box && (
            <div className="search-result">
              {user ? (
                <div className="flex items-center justify-between p-1 border border-gray-300 rounded-lg ">
                  <span className="text-md ml-3">{user?.username}</span>
                  <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">
                    +
                  </button>
                </div>
              ) : (
                <span className="text-md font-semibold text-red-500 ml-3">
                  User Not Found!!
                </span>
              )}
            </div>
          )}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={searchUser}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Document;
