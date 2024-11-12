import { MdOutlineComment } from "react-icons/md";
import { useState } from "react";
import type { CommentProps } from "../types/Comment";

type CommentsProps = {
  isCommentBox: boolean;
  setIsCommentBox: (isCommentBox: boolean) => void;
  comments: CommentProps[]; // Fixed the type definition here
  docId: string | undefined;
};

const Comment: React.FC<CommentsProps> = ({
  isCommentBox,
  setIsCommentBox,
  comments,
  docId,
}) => {
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState<boolean>(false);
  const [selectedComment, setSelectedComment] = useState<CommentProps | null>(
    null
  );
  const [updatedComments, setUpdatedComments] =
    useState<CommentProps[]>(comments);

  const handleCommentClick = () => {
    setIsCommentBoxOpen(!isCommentBoxOpen);
    setIsCommentBox(!isCommentBox);
  };

  const handleCommentSelection = (comment: CommentProps) => {
    setSelectedComment(comment);
  };

  // Function to handle marking the comment as resolved using fetch
  const handleRessolve = async (commentId: string) => {
    try {
      // Send the PUT request to the backend to mark the comment as resolved
      const response = await fetch(
        `http://localhost:3000/docs/comment/ressolve-comment/${docId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commentId }),
        }
      );

      if (response.ok) {
        // Update the local state of comments to reflect the change
        setUpdatedComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, isRessolved: true } // Mark the comment as resolved
              : comment
          )
        );
      } else {
        console.error("Failed to resolve comment");
      }
    } catch (error) {
      console.error("Error marking comment as resolved:", error);
    }
  };

  return (
    <div className="relative">
      {/* Comment Icon */}
      <MdOutlineComment
        className="cursor-pointer text-2xl transition duration-200 ease-in-out"
        onClick={handleCommentClick}
      />

      {/* Comment Box */}
      {isCommentBoxOpen && (
        <div className="mt-4 p-6 border-2 border-gray-200 rounded-lg bg-white shadow-lg absolute w-[380px] right-1">
          <div className="space-y-4">
            {/* Comment Section Title */}
            <h4 className="font-semibold text-xl text-gray-800">Comments</h4>
            <ul className="space-y-2">
              {updatedComments.map((comment) => (
                <li
                  key={comment._id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200"
                >
                  <div
                    className={`text-gray-700 ${
                      comment.isRessolved ? "text-green-500" : ""
                    } cursor-pointer`}
                    onClick={() => handleCommentSelection(comment)} // Display the selected comment details
                  >
                    {comment.message}
                  </div>

                  <button
                    className={`ml-3 p-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      comment.isRessolved
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={comment.isRessolved}
                    onClick={() => handleRessolve(comment._id)} // Pass the comment ID here
                  >
                    {comment.isRessolved ? "Resolved" : "Mark as Resolved"}
                  </button>
                </li>
              ))}
            </ul>
            {/* Displaying the details of the selected comment */}
            {selectedComment && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h5 className="font-semibold text-lg text-gray-700">Details</h5>
                <p className="text-gray-600">{selectedComment._id}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
