import React, { useContext, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles.css";
import { formats, modules } from "../constants";
import { socket } from "../socket";
import { Delta } from "quill";
import { UserContext } from "../UserContext";
import { useParams } from "react-router-dom";
import { UserListProps } from "../types/User";
import { NotFound, Loader, ChatBox, AddCollabModal } from "../components";
import profile from "../assets/image/profile.jpg";

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
  const [userList, setUserList] = useState<UserListProps[]>([]);
  const [selectionRange, setSelectionRange] = useState({
    startOffset: 0,
    endOffset: 0,
  });
  const [selectedText, setSelectedText] = useState("");
  const [isComment, setIsComment] = useState(false); //To add the comment box for text selection

  const context = useContext(UserContext); //to get the logged in user
  if (!context) {
    throw new Error("Header must be used within a UserContextProvider");
  }

  const { user } = context;

  const saveDocument = (content: string) => {
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

            // removing the user's object from the array
            const user_list = [
              // Exclude creator if the username matches
              ...(data.creator.username !== user.username
                ? [
                    {
                      _id: data.creator._id,
                      username: data.creator.username,
                      persona: data.creator.persona,
                    },
                  ]
                : []),

              // Exclude collabs with matching username
              ...data.collab
                .filter((users: any) => users.username !== user.username) // Exclude user with matching username
                .map((user: any) => ({
                  _id: user._id,
                  username: user.username,
                  persona: user.persona,
                })),
            ];
            setUserList(user_list);

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

  const handleMouseUp = () => {
    if (quillRef.current) {
      // Check if quillRef.current is not null
      const editor = quillRef.current.getEditor(); // Get the Quill editor instance
      const selection = editor.getSelection(); // Get the selection range from Quill

      if (selection && selection.length > 0) {
        const selectedContent = editor.getText(
          selection.index,
          selection.length
        );
        setSelectedText(selectedContent);
        setSelectionRange({
          startOffset: selection.index,
          endOffset: selection.index + selection.length,
        });
      } else {
        setSelectedText("");
        setSelectionRange({ startOffset: 0, endOffset: 0 });
      }
    }
  };
  console.log(selectedText);
  console.log(selectionRange);

  if (isLoading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    //If user is not a creator or not a collabarator of a document it will redirect to this page
    return <NotFound />;
  }

  return (
    <div className="text-editor">
      <div className="menu flex justify-between items-center p-2 bg-[#f9fbfd]">
        {/* <!-- Left section (Logo and Menu) --> */}
        <div className="flex items-center flex-grow">
          <div className="flex items-center justify-center">
            <div className="w-[35px] h-[35px] bg-red-600 rounded-full flex items-center justify-center">
              Logo
            </div>
          </div>
          <div className="ml-3">
            <div
              className="text-lg px-3"
              contentEditable
              suppressContentEditableWarning
              ref={divRef}
              onBlur={handleBlur}
              onInput={() => null} //Prevents React from interfering with cursor position -->
            >
              {document.title}
            </div>
            <div className="flex space-x-3">
              <MenuComponent name="File" />
              <MenuComponent name="Edit" />
              <MenuComponent name="View" />
              <MenuComponent name="Insert" />
              <MenuComponent name="Format" />
              <MenuComponent name="Tools" />
            </div>
          </div>
        </div>

        {/* <!-- Right section (Collaborators and Button) --> */}
        <div className="flex items-center justify-end gap-3 mx-5">
          <div className="relative flex">
            {document.collab.map(
              (
                user: { _id: string; username: string; persona: string },
                index: number
              ) => (
                <div
                  key={user.username}
                  className="relative group"
                  style={{ marginLeft: index !== 0 ? "-10px" : "0" }} // slight offset for stacking
                >
                  <img
                    src={`${
                      user.persona.length === 0
                        ? profile
                        : `https://api.dicebear.com/9.x/bottts/svg?seed=${user.persona}&backgroundColor=ffdfbf`
                    }`}
                    alt={user.username}
                    className="w-10 h-10 rounded-full border-2 border-white cursor-pointer transition-transform duration-200 hover:scale-105"
                  />
                  <div className="absolute mb-1 w-max px-2 py-1 text-sm text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {user.username}
                  </div>
                </div>
              )
            )}
          </div>
          <button
            className="bg-blue-500 text-white rounded-md p-2"
            onClick={() => setIsModalOpen(true)}
          >
            Add Collab
          </button>
        </div>
      </div>
      <div className="editor bg-[#f9fbfd]" onMouseUp={handleMouseUp}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
        />
      </div>{" "}
      <ChatBox
        isChatBox={isChatBox}
        setIsChatBox={setIsChatBox}
        docId={docId}
        userId={user?.id}
        username={user?.username}
        persona={user?.persona}
        userList={userList}
      />
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

export default DocumentPage;
