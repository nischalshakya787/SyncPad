import { useState } from "react";
import { User, UserProps } from "../types/User";
import { socket } from "../socket";
import { Document } from "../types/Document";

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

export default AddCollabModal;
