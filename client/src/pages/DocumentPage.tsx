import React, { useContext, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles.css";
import { formats, modules } from "../constants";
import { socket } from "../socket";
import { Delta } from "quill";
import { UserContext } from "../UserContext";
import { useParams } from "react-router-dom";
import { User, UserProps } from "../types/User";
import { NotFound, Loader, ChatBox } from "../components";
import type { Document } from "../types/Document";

const DocumentPage = () => {
  const [value, setValue] = useState<string>("");
  const [document, setDocument] = useState<any>({});
  const [isChatBox, setIsChatBox] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false); //to track if the user is typing or not
  const quillRef = useRef<ReactQuill>(null); // Ref for ReactQuill
  const { id: docId } = useParams<{ id: string }>(); //to fetch the id from /document/:id
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const typingTimeoutRef = useRef<null | number>(null);

  const context = useContext(UserContext); //to get the logged in user
  if (!context) {
    throw new Error("Header must be used within a UserContextProvider");
  }

  const { user } = context;

  const saveDocument = (content: string) => {
    console.log("Kraaa");
    socket.emit("save-document", docId, content);
  };

  useEffect(() => {
    socket.emit("joinDocument", docId); //Add the document to the room

    return () => {
      socket.emit("leaveDocument", docId);
    };
  }, []);

  useEffect(() => {
    // if (!isTyping) {
    socket.on("document", (value: string) => {
      //this is for the user who is not typing
      setValue(value);
    });
    // }
    return () => {
      socket.off("document");
    };
  }, [isTyping, socket]);

  //To reload the saved value of a document
  useEffect(() => {
    const fetchDocument = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:3000/docs/document?docId=${docId}&userId=${user.id}`,
            {
              method: "GET",
            }
          );

          const data = await response.json();
          if (data.notAuthenticated) {
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
            setDocument(data);
            setValue(data.value);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDocument();
  }, [user, docId]); // Add user and docId as dependencies

  //When we type in the canvas this function will execute and emits the updated value to the server and server will emit the changes to the collabs
  const handleChange = (
    content: string,
    delta: Delta,
    source: string,
    editor: any
  ) => {
    if (source === "user") {
      console.log(content);
      socket.emit("document", docId, content); //emitting the typed content to the server
    }
    setValue(content);
    // Clear any existing timeout to reset the inactivity period
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to trigger save after 4 seconds of inactivity
    typingTimeoutRef.current = window.setTimeout(() => {
      saveDocument(content); // Send the latest content to server
    }, 4000);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  //For updating the name of the docs. When we are updating the name of the docs and when user clicks away from the div this will execute
  const handleBlur = async () => {
    if (divRef.current) {
      const updatedTitle = divRef.current.textContent || "";
      setDocument({ ...document, title: updatedTitle });

      // Make an API call with the latest title
      try {
        const response = await fetch(
          "http://localhost:3000/docs/document/update-name",
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
      } catch (error) {
        console.error("Error updating document title:", error);
      }
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    //If user is not a creator or not a collabarator of a document it will redirect to this page
    return <NotFound />;
  }

  return (
    <div className="text-editor">
      <div className="menu flex p-2 bg-[#f9fbfd]">
        <div className="w-[80%] flex">
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
              {document.title}
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
        <div className="w-[20%] flex items-center justify-end pr-8 gap-3">
          <button
            className="bg-blue-500 text-white rounded-md p-2"
            onClick={() => setIsModalOpen(true)}
          >
            Add Collab
          </button>
        </div>
      </div>
      <div className="editor bg-[#f9fbfd]">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
        />
      </div>{" "}
      <ChatBox isChatBox={isChatBox} setIsChatBox={setIsChatBox} />
      {isModalOpen && (
        <AddCollabModal
          setIsModalOpen={setIsModalOpen}
          document={document}
          sender={user}
        />
      )}
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
  document: Document;
  sender: UserProps | null;
};

const AddCollabModal = ({
  setIsModalOpen,
  document,
  sender,
}: AddCollabModal) => {
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<User | null>(null); //To the searched user
  const [box, setBox] = useState<boolean>(false); //To show the result box only at the beginning
  const [isAdded, setIsAdded] = useState<boolean>(false); //To check if the returned user is a already in collab or not

  //Search for user to add collab
  const searchUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/docs/user?email=${email}&docId=${document._id}`
      );
      if (!response.ok) {
        throw Error("Server error");
      }
      setBox(true);
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        setIsAdded(data.isCollab); // isCollab: true/false
      } else {
        setUser(null);
        setIsAdded(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Closing modal
  const handleClose = () => {
    setIsModalOpen(false);
    setBox(false);
  };

  const sendCollabRequest = async () => {
    socket.emit("sendCollabRequest", user?._id, document, sender);
  };

  return (
    <div
      style={{ zIndex: "3" }}
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md "
    >
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
                  <button
                    className={`${
                      !isAdded ? "bg-blue-500" : "bg-green-500"
                    } text-white font-semibold py-2 px-4 rounded ${
                      !isAdded ? "hover:bg-blue-600" : "hover:bg-green-600"
                    }`}
                    onClick={() => (!isAdded ? sendCollabRequest() : null)}
                  >
                    {!isAdded ? "+" : "o"}
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

export default DocumentPage;
