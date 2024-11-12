import { FaComment } from "react-icons/fa";
import { useState } from "react";
import type { CommentProps } from "../types/Comment";

type CommentsProps = {
  isCommentBox: boolean;
  setIsCommentBox: (isCommentBox: boolean) => void;
  comments: [CommentProps];
};

interface CommentType {
  id: number;
  text: string;
  approved: boolean;
}

const Comment: React.FC<CommentsProps> = ({
  isCommentBox,
  setIsCommentBox,
}) => {
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]); // Array of comments
  const [newComment, setNewComment] = useState<string>(""); // Current new comment text

  const handleCommentClick = () => {
    setIsCommentBoxOpen(!isCommentBoxOpen);
    setIsCommentBox(!isCommentBox);
  };

  const handleMarkAsApproved = (commentId: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, approved: !comment.approved }
          : comment
      )
    );
  };

  return (
    <div>
      <FaComment
        className="text-blue-500 cursor-pointer text-xl"
        onClick={handleCommentClick}
      />

      {isCommentBoxOpen && (
        <div className="mt-2 p-4 border rounded-md bg-white shadow-md absolute w-[250px] right-1">
          <div className="">
            <h4 className="font-semibold text-lg">Comments</h4>
            <ul className="list-disc pl-4">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="flex justify-between items-center"
                >
                  <span className={comment.approved ? "text-green-500" : ""}>
                    {comment.text}
                  </span>
                  <button
                    className={`ml-2 p-1 text-sm ${
                      comment.approved ? "bg-gray-300" : "bg-blue-500"
                    } text-white rounded`}
                    onClick={() => handleMarkAsApproved(comment.id)}
                  >
                    {comment.approved ? "Approved" : "Mark as Approved"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
