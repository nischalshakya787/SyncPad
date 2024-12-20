import React, { useContext, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import logo from "../assets/logo.svg";
import "react-quill/dist/quill.snow.css";
import "../styles.css";
import { formats, modules } from "../constants";
import { socket } from "../socket";
import { Delta } from "quill";
import { UserContext } from "../UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { UserListProps } from "../types/User";
import {
  NotFound,
  Loader,
  ChatBox,
  AddCollabModal,
  Comment,
} from "../components";
import { MdOutlineAddComment } from "react-icons/md";
import profile from "../assets/image/profile.jpg";
import Highlight from "./Highlight";
import { CommentProps } from "../types/Comment";

Quill.register(Highlight); //Registering a custom class for Quill

const DocumentPage = () => {
  const navigate = useNavigate();
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
  const [isCommentBox, setIsCommentBox] = useState<boolean>(false);
  const [commentBoxPosition, setCommentBoxPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [isComment, setIsComment] = useState(false); //To add the comment box for text selection
  const commentRef = useRef(null);
  const context = useContext(UserContext); //to get the logged in user
  if (!context) {
    throw new Error("Header must be used within a UserContextProvider");
  }

  const { user } = context;

  const saveDocument = (content: string) => {
    socket.emit("save-document", docId, content);
  };

  //To close the comment-section if user clicks outside of the comment section
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commentRef.current &&
        !commentRef.current.contains(event.target as Node)
      ) {
        setIsCommentBox(false);
      }
    };

    // Attach the event listener to the document
    window.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsCommentBox]);
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

            if (data.comments.length !== 0) {
              applyHighlights(data.value, data.comments); //if comment exsits then applies hhighlight to the commented portion
            } else {
              setValue(data.value);
            }
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

  //This will highlight the comment portion by adding a custom class
  const applyHighlights = (content: string, comments: [CommentProps]) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      // Using Quill's clipboard to insert content but retain the HTML structure
      quill.clipboard.dangerouslyPasteHTML(content);

      comments.forEach((comment) => {
        const { startOffset, endOffset } = comment.selectionRange;

        // Apply the highlight to the selection range
        if (!comment.isRessolved) {
          quill.formatText(
            startOffset, //start
            endOffset - startOffset, //length
            "highlight", //custom-class
            true
          );
        } else {
          quill.formatText(
            startOffset, //start
            endOffset - startOffset, //length
            "highlight", //custom-class
            false //Removes the class
          );
        }
      });
    }
  };

  const handleMouseUp = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const selection = editor.getSelection();

      if (selection && selection.length > 0) {
        const selectedContent = editor.getText(
          selection.index,
          selection.length
        );
        setSelectedText(selectedContent);
        // Capture the start and end offset of the selection
        const startOffset = selection.index;
        const endOffset = selection.index + selection.length;

        setSelectionRange({
          startOffset,
          endOffset,
        });

        const range = window.getSelection()?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          setCommentBoxPosition({
            top: rect.top + window.scrollY - 120, // Adjust for page scroll
            left: rect.left + window.scrollX, // Adjust for page scroll
          });
        }
      } else {
        setSelectedText("");
        setCommentBoxPosition(null); // Hide comment box if no text is selected
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains("highlighted-text")
    ) {
      setIsCommentBox(true);
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
      <div className="menu flex justify-between items-center p-2 bg-[#f9fbfd]">
        {/* <!-- Left section (Logo and Menu) --> */}
        <div className="flex items-center flex-grow">
          <div className="flex items-center justify-center">
            <div
              className="flex  items-center rounded-full h-[45px] w-[45px] ml-5 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                loading="lazy"
                src={logo}
                alt="logo"
                className="object-contain aspect-square"
              />
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
            <div className="flex items-center mx-5" ref={commentRef}>
              <Comment
                isCommentBox={isCommentBox}
                setIsCommentBox={setIsCommentBox}
                comments={document.comments}
                docId={docId}
                quillRef={quillRef}
              />
            </div>
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
                      user.persona?.length === 0
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
      <div
        className="editor bg-[#f9fbfd] relative"
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      >
        {commentBoxPosition && (
          <div
            style={{
              position: "absolute",
              top: commentBoxPosition.top,
              left: commentBoxPosition.left,
              zIndex: 3,
            }}
            className="cursor-pointer"
          >
            <button
              className="bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600 text-2xl"
              onClick={() => {
                setIsComment(!isComment);
              }}
            >
              <MdOutlineAddComment />
            </button>
          </div>
        )}
        <CommentBox
          isComment={isComment}
          commentBoxPosition={commentBoxPosition}
          selectionRange={selectionRange}
          selectionText={selectedText}
          docId={docId}
          setDocument={setDocument}
          setValue={setValue}
          setIsComment={setIsComment}
        />

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

type CommentBoxProps = {
  isComment: boolean;
  commentBoxPosition: { top: number; left: number } | null;
  selectionRange: { startOffset: number; endOffset: number };
  selectionText: string;
  docId: string | undefined;
  setDocument: (document: any) => void; // Function to set the document state (use a more specific type if possible)
  setValue: (value: string) => void; // Function to update the document content value
  setIsComment: (isComment: boolean) => void; // Function to toggle the state of the comment box visibility
};

const CommentBox = ({
  isComment,
  commentBoxPosition,
  selectionRange,
  docId,
  setDocument,
  setValue,
  setIsComment,
}: CommentBoxProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(commentBoxPosition);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (commentBoxPosition) {
      setPosition({
        top: commentBoxPosition.top + 90,
        left: commentBoxPosition.left - 100,
      }); // Update position to match commentBoxPosition
    }
  }, [isComment]); // Depend on commentBoxPosition

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        top: e.clientY - 100, // Adjust for header offset
        left: e.clientX - 100, // Adjust for header offset
      });
    }
  };
  const handleCommentSubmit = async () => {
    if (message.trim()) {
      try {
        const comment = {
          message,
          selectionRange,
        };
        console.log(comment);
        const response = await fetch(
          `http://localhost:3000/docs/comment/${docId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment }),
          }
        );
        if (!response.ok) {
          throw Error("Failed to add comment");
        }
        const data = await response.json();
        setIsComment(false);
        setDocument(data.document);
        setValue(data.document.value);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: position?.top,
        left: position?.left,
        zIndex: 3,
        width: "300px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      }}
      className={`${isComment ? "block" : "hidden"}`}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
    >
      {/* Header section for dragging */}
      <div
        style={{
          padding: "8px",
          backgroundColor: "#3b82f6",
          color: "#fff",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          cursor: "move",
          userSelect: "none",
        }}
      >
        Add Comment
      </div>

      {/* Content section */}
      <div style={{ padding: "12px" }}>
        <input
          type="text"
          placeholder="Add your comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleCommentSubmit}
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DocumentPage;
